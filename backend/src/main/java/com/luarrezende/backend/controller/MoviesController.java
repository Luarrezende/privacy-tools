package com.luarrezende.backend.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import com.luarrezende.backend.service.MoviesService;

@RestController
@RequestMapping("/api/movies")
public class MoviesController {
    private final MoviesService moviesService;

    public MoviesController(MoviesService moviesService) {
        this.moviesService = moviesService;
    }

    @GetMapping("/search")
    public ResponseEntity<String> searchMovie(@RequestParam String title) {
        return moviesService.searchMovie(title);
    }

    @GetMapping("/search-json")
    public ResponseEntity<String> searchMovieJson(@RequestParam String title, @RequestParam(defaultValue = "1") int page) {
        return moviesService.searchMovieJson(title, page);
    }

    @GetMapping("/details")
    public ResponseEntity<?> getMovieDetails(@RequestParam String id, @RequestParam(defaultValue = "short") String plot) {
        return moviesService.getMovieDetails(id, plot);
    }
}
