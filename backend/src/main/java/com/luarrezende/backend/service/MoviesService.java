package com.luarrezende.backend.service;

import com.luarrezende.backend.dto.MovieDetailDto;
import com.luarrezende.backend.dto.SearchAllDto;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;

@Service
public class MoviesService {
    private final RestTemplate restTemplate;

    @Value("${omdb.api.key}")
    private String apiKey;

    @Autowired
    public MoviesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<?> searchMovie(String title) {
        if (title == null || title.trim().length() < 3) {
            String jsonError = "{\"Response\":\"False\", \"Error\":\"Termo de busca muito genérico. Digite pelo menos 3 caracteres.\"}";
            return ResponseEntity.badRequest().body(jsonError);
        }

        String url = String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title.trim(), apiKey);

        try {
            MovieDetailDto response = restTemplate.getForObject(url, MovieDetailDto.class);
            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }

    public ResponseEntity<?> searchAllMovies(String title, int page) {
        if (title == null || title.trim().length() < 3) {
            String jsonError = "{\"Response\":\"False\", \"Error\":\"Termo de busca muito genérico. Digite pelo menos 3 caracteres.\"}";
            return ResponseEntity.badRequest().body(jsonError);
        }

        if (page < 1) {
            page = 1;
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            SearchAllDto response = restTemplate.getForObject(url, SearchAllDto.class);
            return ResponseEntity.ok(response); 
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }

    public ResponseEntity<?> getMovieDetails(String id, String plot) {
    String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s&plot=%s", id, apiKey, plot);
    try {
        MovieDetailDto response = restTemplate.getForObject(url, MovieDetailDto.class);
        return ResponseEntity.ok(response);
    } catch (HttpClientErrorException e) {
        return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
    }
}
        
}
