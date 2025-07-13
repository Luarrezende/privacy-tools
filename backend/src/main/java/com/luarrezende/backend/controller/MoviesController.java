package com.luarrezende.backend.controller;

import com.luarrezende.backend.service.MoviesService;
import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/movies")
@Tag(name = "Movies", description = "API para busca e obtenção de detalhes de filmes")
public class MoviesController {
    
    private final MoviesService moviesService;

    public MoviesController(MoviesService moviesService) {
        this.moviesService = moviesService;
    }

    @GetMapping("/search")
    @Operation(
        summary = "Buscar filme por título",
        description = "Busca um filme específico pelo título e retorna os detalhes completos"
    )
    public ResponseEntity<MovieDetailsResponse> searchMovie(
        @Parameter(description = "Título do filme a ser buscado", required = true, example = "The Matrix")
        @RequestParam String title) {
        return moviesService.searchMovie(title);
    }

    @GetMapping("/searchall")
    @Operation(
        summary = "Buscar todos os filmes por título",
        description = "Busca todos os filmes que correspondem ao título especificado com suporte a paginação"
    )
    public ResponseEntity<MovieSearchResponse> searchAllMovies(
            @Parameter(description = "Título do filme a ser buscado", required = true, example = "Matrix")
            @RequestParam String title, 
            @Parameter(description = "Número da página para paginação", required = false, example = "1")
            @RequestParam(defaultValue = "1") int page) {
        return (ResponseEntity<MovieSearchResponse>) moviesService.searchAllMovies(title, page);
    }

    @GetMapping("/details")
    @Operation(
        summary = "Obter detalhes do filme",
        description = "Obtém os detalhes completos de um filme específico usando seu ID"
    )
    public ResponseEntity<MovieDetailsResponse> getMovieDetails(
            @Parameter(description = "ID único do filme", required = true, example = "tt0133093")
            @RequestParam String id, 
            @Parameter(description = "Tipo de sinopse a ser retornada", required = false, example = "full")
            @RequestParam(defaultValue = "short") String plot) {
        return (ResponseEntity<MovieDetailsResponse>) moviesService.getMovieDetails(id, plot);
    }
}
