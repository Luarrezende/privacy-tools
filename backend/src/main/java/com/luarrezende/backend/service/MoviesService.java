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
        // System.out.println("Buscando filme antes: " + title);
        // System.out.println("API KEY carregada antes: " + apiKey);
        // System.out.println("URL da requisição antes: " + String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title, apiKey));
        String url = String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title, apiKey);
        // System.out.println("Buscando filme depois: " + title);
        // System.out.println("URL da requisição depois: " + url);
        // System.out.println("API KEY carregada depois: " + apiKey);
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> searchMovieJson(String title, int page) {
        if (title == null || title.trim().length() < 3) {
            // Retorna erro 400 com mensagem JSON personalizada
            String jsonError = "{\"Response\":\"False\", \"Error\":\"Termo de busca muito genérico. Digite pelo menos 3 caracteres.\"}";
            return ResponseEntity.badRequest().body(jsonError);
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            return restTemplate.getForEntity(url, String.class);
        } catch (HttpClientErrorException e) {
            // Retorna o erro da OMDb para o frontend tratar
            return ResponseEntity.status(e.getStatusCode()).body(e.getResponseBodyAsString());
        }
    }
}
