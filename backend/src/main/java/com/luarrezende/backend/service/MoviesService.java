package com.luarrezende.backend.service;

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

    public ResponseEntity<String> searchMovie(String title) {
        String url = String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title, apiKey);
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> searchMovieJson(String title, int page) {
        if (title == null || title.trim().length() < 3) {
            String jsonError = "{\"Response\":\"False\", \"Error\":\"Termo de busca muito genérico. Digite pelo menos 3 caracteres.\"}";
            return ResponseEntity.badRequest().body(jsonError);
        }

        if (page < 1) {
            page = 1;
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }

    public ResponseEntity<String> searchMovieById(String id) {
        String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s", id, apiKey);
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }

    public ResponseEntity<String> getMovieDetails(String id, String plot) {
        String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s&plot=%s", id, apiKey, plot);
        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }
        
}
