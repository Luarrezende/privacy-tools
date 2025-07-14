package com.luarrezende.backend.service;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MoviesServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private MoviesService moviesService;

    @Test
    void deveBuscarFilmeComSucesso() {
        // Given
        String title = "The Matrix";
        
        // Mock da resposta da API externa
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setTitle("The Matrix");
        mockApiResponse.setYear("1999");
        mockApiResponse.setResponse("True");
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);

        // When
        ResponseEntity<?> result = moviesService.searchMovie(title);

        // Then
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
}
