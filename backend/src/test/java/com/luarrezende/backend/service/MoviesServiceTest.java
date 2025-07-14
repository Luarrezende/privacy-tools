package com.luarrezende.backend.service;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.dto.MovieSearchResponse;

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
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

@ExtendWith(MockitoExtension.class)
class MoviesServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private MoviesService moviesService;

    @Test
    void deveBuscarFilmeComSucesso() {
        String title = "The Matrix";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setTitle("The Matrix");
        mockApiResponse.setYear("1999");
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTratarErrosDaApiGraciosamente() {
        String title = "NonExistentMovie";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
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
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveBuscarTodosOsFilmesComPaginacao() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("3");
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTratarTermoDeBuscaInvalidoMuitoCurto() {
        String shortTitle = "Ma"; // Menos de 3 caracteres

        ResponseEntity<?> result = moviesService.searchMovie(shortTitle);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void deveTratarTermoDeBuscaNulo() {
        String nullTitle = null;

        ResponseEntity<?> result = moviesService.searchMovie(nullTitle);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
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
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(null);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    void deveTratarParametroDePaginaMenorQueUm() {
        String title = "Matrix";
        int invalidPage = 0;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("3");
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, invalidPage);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTratarResultadosDeBuscaVazios() {
        String title = "FilmeInexistente";
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setResponse("False");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, 1);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
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
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(null);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTestarIsEmptySearchResponseComResponseFalse() {
        String title = "Matrix";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setResponse("False");
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchAllMovies(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTestarIsEmptyResponseComResponseNullNoSearchMovie() {
        String title = "Matrix";
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(null);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTestarIsEmptyResponseComResponseFalseNoSearchMovie() {
        String title = "Matrix";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.searchMovie(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTestarIsEmptyResponseComResponseNullNoGetMovieDetails() {
        String movieId = "tt0133093";
        String plot = "full";
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(null);

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTestarIsEmptyResponseComResponseFalseNoGetMovieDetails() {
        String movieId = "tt0133093";
        String plot = "full";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<?> result = moviesService.getMovieDetails(movieId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
    }

    @Test
    void deveTestarValidSearchTermComTituloInvalidoNoSearchAllMovies() {
        String invalidTitle = "ab"; // Menos de 3 caracteres
        int page = 1;

        ResponseEntity<?> result = moviesService.searchAllMovies(invalidTitle, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate, never()).getForObject(anyString(), eq(SearchAllDto.class));
    }

    @Test
    void deveTestarValidSearchTermComTituloNuloNoSearchAllMovies() {
        String nullTitle = null;
        int page = 1;

        ResponseEntity<?> result = moviesService.searchAllMovies(nullTitle, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate, never()).getForObject(anyString(), eq(SearchAllDto.class));
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
