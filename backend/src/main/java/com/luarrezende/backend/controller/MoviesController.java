package com.luarrezende.backend.controller;

import com.luarrezende.backend.service.MoviesService;

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
    public ResponseEntity<?> searchMovie(@RequestParam String title) {
        return moviesService.searchMovie(title);
    }

    @GetMapping("/searchAll")
    public ResponseEntity<?> searchAllMovies(@RequestParam String title, @RequestParam(defaultValue = "1") int page) {
        return moviesService.searchAllMovies(title, page);
    }

    @GetMapping("/details")
    public ResponseEntity<?> getMovieDetails(@RequestParam String id, @RequestParam(defaultValue = "short") String plot) {
        return moviesService.getMovieDetails(id, plot);
    }
}
