package com.luarrezende.backend.controller;

import com.luarrezende.backend.service.MoviesService;
import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/movies")
public class MoviesController {
    
    private final MoviesService moviesService;

    public MoviesController(MoviesService moviesService) {
        this.moviesService = moviesService;
    }

    @GetMapping("/search")
    public ResponseEntity<MovieDetailsResponse> searchMovie(@RequestParam String title) {
        return moviesService.searchMovie(title);
    }

    @GetMapping("/searchall")
    public ResponseEntity<MovieSearchResponse> searchAllMovies(
            @RequestParam String title, 
            @RequestParam(defaultValue = "1") int page) {
        return (ResponseEntity<MovieSearchResponse>) moviesService.searchAllMovies(title, page);
    }

    @GetMapping("/details")
    public ResponseEntity<MovieDetailsResponse> getMovieDetails(
            @RequestParam String id, 
            @RequestParam(defaultValue = "short") String plot) {
        return (ResponseEntity<MovieDetailsResponse>) moviesService.getMovieDetails(id, plot);
    }
}
