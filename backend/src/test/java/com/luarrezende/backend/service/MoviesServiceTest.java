package com.luarrezende.backend.service;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.dto.MovieSearchResponse;
import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.mapper.MovieMapper;
import com.luarrezende.backend.mapper.ErrorResponseMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class MoviesServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private MovieMapper movieMapper;

    @Mock
    private ErrorResponseMapper errorResponseMapper;

    @InjectMocks
    private MoviesService moviesService;

    @Test
    void deveBuscarFilmeComSucesso() {
        String title = "The Matrix";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setTitle("The Matrix");
        mockApiResponse.setYear("1999");
        mockApiResponse.setResponse("True");
        
        MovieDetailsResponse mockMappedResponse = MovieDetailsResponse.builder()
                .title("The Matrix")
                .year("1999")
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(movieMapper.convertToMovieDetailsResponse(mockApiResponse))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(movieMapper).convertToMovieDetailsResponse(mockApiResponse);
    }

    @Test
    void deveTratarErrosDaApiGraciosamente() {
        String title = "NonExistentMovie";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Filme não encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(errorResponseMapper.createMovieNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(errorResponseMapper).createMovieNotFoundResponse();
    }

    @Test
    void deveObterDetalhesDoFilmePorId() {
        String movieId = "tt0133093";
        String plot = "full";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setImdbID("tt0133093");
        mockApiResponse.setTitle("The Matrix");
        mockApiResponse.setPlot("Full plot here");
        mockApiResponse.setResponse("True");
        
        MovieDetailsResponse mockMappedResponse = MovieDetailsResponse.builder()
                .id("tt0133093")
                .title("The Matrix")
                .plot("Full plot here")
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(movieMapper.convertToMovieDetailsResponse(mockApiResponse))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(movieMapper).convertToMovieDetailsResponse(mockApiResponse);
    }

    @Test
    void deveBuscarTodosOsFilmesComPaginacao() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("3");
        mockApiResponse.setResponse("True");
        
        MovieSearchResponse mockMappedResponse = MovieSearchResponse.builder()
                .searchTerm(title)
                .currentPage(page)
                .totalResults(3)
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);
        when(movieMapper.convertToMovieSearchResponse(eq(mockApiResponse), eq(title), eq(page), anyLong()))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
        verify(movieMapper).convertToMovieSearchResponse(eq(mockApiResponse), eq(title), eq(page), anyLong());
    }

    @Test
    void deveTratarTermoDeBuscaInvalidoMuitoCurto() {
        String shortTitle = "Ma"; // Menos de 3 caracteres

        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
                .build();
        
        when(errorResponseMapper.createSearchErrorResponse())
                .thenReturn(ResponseEntity.badRequest().body(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchMovie(shortTitle);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(errorResponseMapper).createSearchErrorResponse();
    }

    @Test
    void deveTratarTermoDeBuscaNulo() {
        String nullTitle = null;

        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
                .build();
        
        when(errorResponseMapper.createSearchErrorResponse())
                .thenReturn(ResponseEntity.badRequest().body(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchMovie(nullTitle);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(errorResponseMapper).createSearchErrorResponse();
    }

    @Test
    void deveTratarExcecaoDoRestTemplate() {
        String title = "Matrix";
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(new RuntimeException("Falha na conexão com a API"));

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    void deveTratarRespostaNulaDaApi() {
        String title = "Matrix";
        
        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Filme não encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(null);
        when(errorResponseMapper.createMovieNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(errorResponseMapper).createMovieNotFoundResponse();
    }

    @Test
    void deveTratarParametroDePaginaMenorQueUm() {
        String title = "Matrix";
        int invalidPage = 0;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("3");
        mockApiResponse.setResponse("True");
        
        MovieSearchResponse mockMappedResponse = MovieSearchResponse.builder()
                .searchTerm(title)
                .currentPage(1) // O service corrige página 0 para 1
                .totalResults(3)
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);
        when(movieMapper.convertToMovieSearchResponse(eq(mockApiResponse), eq(title), eq(1), anyLong()))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, invalidPage);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
        verify(movieMapper).convertToMovieSearchResponse(eq(mockApiResponse), eq(title), eq(1), anyLong());
    }

    @Test
    void deveTratarResultadosDeBuscaVazios() {
        String title = "FilmeInexistente";
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setResponse("False");
        
        MovieSearchResponse mockErrorResponse = MovieSearchResponse.builder()
                .searchTerm(title)
                .currentPage(1)
                .totalResults(0)
                .success(false)
                .errorMessage("Nenhum filme encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);
        when(errorResponseMapper.createSearchAllErrorResponse(eq(title), eq(1), anyLong(), eq("Nenhum filme encontrado")))
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchAllMovies(title, 1);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(errorResponseMapper).createSearchAllErrorResponse(eq(title), eq(1), anyLong(), eq("Nenhum filme encontrado"));
    }

    @Test
    void deveTratarHttpClientErrorExceptionNoSearchMovie() {
        String title = "Matrix";
        HttpClientErrorException httpError = new HttpClientErrorException(HttpStatus.NOT_FOUND, "API Error");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(httpError);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTratarHttpClientErrorExceptionNoSearchAllMovies() {
        String title = "Matrix";
        int page = 1;
        HttpClientErrorException httpError = new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Invalid API Key");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenThrow(httpError);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTratarHttpClientErrorExceptionNoGetMovieDetails() {
        String movieId = "tt0133093";
        String plot = "full";
        HttpClientErrorException httpError = new HttpClientErrorException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(httpError);

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTratarExcecaoGeralNoSearchMovie() {
        String title = "Matrix";
        RuntimeException generalError = new RuntimeException("Conexão perdida");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(generalError);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTratarTimeoutExceptionNoSearchMovie() {
        String title = "Matrix";
        RuntimeException timeoutError = new RuntimeException("Read timed out");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(timeoutError);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTratarIllegalArgumentExceptionNoSearchAllMovies() {
        String title = "Matrix";
        int page = 1;
        IllegalArgumentException illegalArgError = new IllegalArgumentException("Invalid URL");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenThrow(illegalArgError);

        assertThatThrownBy(() -> moviesService.searchAllMovies(title, page))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid URL");
        
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTratarResourceAccessExceptionNoGetMovieDetails() {
        String movieId = "tt0133093";
        String plot = "full";
        RuntimeException resourceError = new RuntimeException("I/O error");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(resourceError);

        assertThatThrownBy(() -> moviesService.getMovieDetails(movieId, plot))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("I/O error");
        
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTratarRestClientExceptionNoSearchMovie() {
        String title = "Matrix";
        RuntimeException restClientError = new RuntimeException("Network error");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenThrow(restClientError);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTestarParseIntegerSafelyComValorValido() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("123");
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTestarParseIntegerSafelyComValorInvalido() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("invalid_number");
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);

        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTestarParseIntegerSafelyComValorNulo() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults(null);
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTestarIsEmptySearchResponseComResponseNull() {
        String title = "Matrix";
        int page = 1;
        
        MovieSearchResponse mockErrorResponse = MovieSearchResponse.builder()
                .searchTerm(title)
                .currentPage(page)
                .totalResults(0)
                .success(false)
                .errorMessage("Erro na API do OMDB")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(null);
        when(errorResponseMapper.createSearchAllErrorResponse(eq(title), eq(page), anyLong(), eq("Erro na API do OMDB")))
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
        verify(errorResponseMapper).createSearchAllErrorResponse(eq(title), eq(page), anyLong(), eq("Erro na API do OMDB"));
    }

    @Test
    void deveTestarIsEmptySearchResponseComResponseFalse() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setResponse("False");
        
        MovieSearchResponse mockErrorResponse = MovieSearchResponse.builder()
                .searchTerm(title)
                .currentPage(page)
                .totalResults(0)
                .success(false)
                .errorMessage("Nenhum filme encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);
        when(errorResponseMapper.createSearchAllErrorResponse(eq(title), eq(page), anyLong(), eq("Nenhum filme encontrado")))
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
        verify(errorResponseMapper).createSearchAllErrorResponse(eq(title), eq(page), anyLong(), eq("Nenhum filme encontrado"));
    }

    @Test
    void deveTestarIsEmptyResponseComResponseNullNoSearchMovie() {
        String title = "Matrix";
        
        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Filme não encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(null);
        when(errorResponseMapper.createMovieNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(errorResponseMapper).createMovieNotFoundResponse();
    }

    @Test
    void deveTestarIsEmptyResponseComResponseFalseNoSearchMovie() {
        String title = "Matrix";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Filme não encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(errorResponseMapper.createMovieNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(errorResponseMapper).createMovieNotFoundResponse();
    }

    @Test
    void deveTestarIsEmptyResponseComResponseNullNoGetMovieDetails() {
        String movieId = "tt0133093";
        String plot = "full";
        
        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Filme não encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(null);
        when(errorResponseMapper.createMovieNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(errorResponseMapper).createMovieNotFoundResponse();
    }

    @Test
    void deveTestarIsEmptyResponseComResponseFalseNoGetMovieDetails() {
        String movieId = "tt0133093";
        String plot = "full";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        MovieDetailsResponse mockErrorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Filme não encontrado")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(errorResponseMapper.createMovieNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(errorResponseMapper).createMovieNotFoundResponse();
    }

    @Test
    void deveTestarValidSearchTermComTituloInvalidoNoSearchAllMovies() {
        String invalidTitle = "ab"; // Menos de 3 caracteres
        int page = 1;

        MovieSearchResponse mockErrorResponse = MovieSearchResponse.builder()
                .searchTerm(invalidTitle)
                .currentPage(page)
                .totalResults(0)
                .success(false)
                .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
                .build();
        
        when(errorResponseMapper.createSearchAllErrorResponse(eq(invalidTitle), eq(page), anyLong(), eq("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")))
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchAllMovies(invalidTitle, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate, never()).getForObject(anyString(), eq(SearchAllDto.class));
        verify(errorResponseMapper).createSearchAllErrorResponse(eq(invalidTitle), eq(page), anyLong(), eq("Termo de busca muito genérico. Digite pelo menos 3 caracteres."));
    }

    @Test
    void deveTestarValidSearchTermComTituloNuloNoSearchAllMovies() {
        String nullTitle = null;
        int page = 1;

        MovieSearchResponse mockErrorResponse = MovieSearchResponse.builder()
                .searchTerm("")
                .currentPage(page)
                .totalResults(0)
                .success(false)
                .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
                .build();
        
        when(errorResponseMapper.createSearchAllErrorResponse(eq(""), eq(page), anyLong(), eq("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")))
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = moviesService.searchAllMovies(nullTitle, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate, never()).getForObject(anyString(), eq(SearchAllDto.class));
        verify(errorResponseMapper).createSearchAllErrorResponse(eq(""), eq(page), anyLong(), eq("Termo de busca muito genérico. Digite pelo menos 3 caracteres."));
    }

    @Test
    void deveTestarSearchTermTernaryOperatorNoCatchBlockDoSearchAllMovies() {
        String title = "Matrix";
        int page = 1;
        HttpClientErrorException httpError = new HttpClientErrorException(HttpStatus.BAD_REQUEST, "Invalid API Key");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenThrow(httpError);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        if (result.getBody() instanceof MovieSearchResponse) {
            MovieSearchResponse response = (MovieSearchResponse) result.getBody();
            assertThat(response.getSearchTerm()).isEqualTo(title.trim());
        }
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }
}
