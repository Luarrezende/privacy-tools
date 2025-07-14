package com.luarrezende.backend.controller;

import com.luarrezende.backend.service.MoviesService;
import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MoviesController.class)
@WithMockUser
class MoviesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MoviesService moviesService;

    @Test
    void deveBuscarFilmePorTituloComSucesso() throws Exception {
        String title = "The Matrix";
        MovieDetailsResponse mockResponse = MovieDetailsResponse.builder()
                .title("The Matrix")
                .year("1999")
                .build();
        
        when(moviesService.searchMovie(anyString())).thenReturn(ResponseEntity.ok(mockResponse));
        mockMvc.perform(get("/api/movies/search")
                .param("title", title)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("The Matrix"))
                .andExpect(jsonPath("$.year").value("1999"));
    }

    @Test
    void deveObterDetalhesDoFilmePorId() throws Exception {
        String id = "tt0133093";
        String plot = "full";
        MovieDetailsResponse mockResponse = MovieDetailsResponse.builder()
                .id(id)
                .title("The Matrix")
                .plot("A computer programmer is led to fight an underground war against powerful computers")
                .build();
        
        when(moviesService.getMovieDetails(anyString(), anyString())).thenReturn(ResponseEntity.ok(mockResponse));
        mockMvc.perform(get("/api/movies/details")
                .param("id", id)
                .param("plot", plot)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id))
                .andExpect(jsonPath("$.title").value("The Matrix"));
    }

    @Test
    void deveUsarParametroPlotPadrao() throws Exception {
        String id = "tt0133093";
        MovieDetailsResponse mockResponse = MovieDetailsResponse.builder()
                .id(id)
                .title("The Matrix")
                .build();
        
        when(moviesService.getMovieDetails(anyString(), anyString())).thenReturn(ResponseEntity.ok(mockResponse));
        mockMvc.perform(get("/api/movies/details")
                .param("id", id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void deveBuscarTodosOsFilmesComPaginacao() throws Exception {
        String title = "Matrix";
        int page = 1;
        MovieSearchResponse mockResponse = MovieSearchResponse.builder()
                .totalResults(3)
                .build();
        
        when(moviesService.searchAllMovies(anyString(), anyInt())).thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/movies/searchall")
                .param("title", title)
                .param("page", String.valueOf(page))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalResults").value(3));
    }

    @Test
    void deveTratarParametroTitleAusente() throws Exception {
        mockMvc.perform(get("/api/movies/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveTratarParametroTitleAusenteNoSearchAll() throws Exception {
        mockMvc.perform(get("/api/movies/searchall")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveTratarParametroIdAusente() throws Exception {
        mockMvc.perform(get("/api/movies/details")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveUsarParametroPaginaPadrao() throws Exception {
        String title = "Matrix";
        MovieSearchResponse mockResponse = MovieSearchResponse.builder()
                .totalResults(3)
                .currentPage(1)
                .build();
        
        when(moviesService.searchAllMovies(anyString(), anyInt())).thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/movies/searchall")
                .param("title", title)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentPage").value(1));
    }

    @Test
    void deveTratarErroDoServicoGraciosamente() throws Exception {
        String title = "Error Movie";
        MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro no serviço")
                .build();
        
        when(moviesService.searchMovie(anyString())).thenReturn(ResponseEntity.badRequest().body(errorResponse));

        mockMvc.perform(get("/api/movies/search")
                .param("title", title)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.errorMessage").value("Erro no serviço"));
    }
}
