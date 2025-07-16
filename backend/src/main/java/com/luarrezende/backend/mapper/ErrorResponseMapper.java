package com.luarrezende.backend.mapper;

import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ErrorResponseMapper {
    
    public ResponseEntity<MovieDetailsResponse> createSearchErrorResponse() {
        MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
            .success(false)
            .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
            .build();
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    public ResponseEntity<MovieDetailsResponse> createMovieNotFoundResponse() {
        MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
            .success(false)
            .errorMessage("Filme não encontrado")
            .build();
        return ResponseEntity.ok(errorResponse);
    }
    
    public ResponseEntity<MovieSearchResponse> createSearchAllErrorResponse(String searchTerm, int page, long startTime, String message) {
        MovieSearchResponse errorResponse = MovieSearchResponse.builder()
            .success(false)
            .errorMessage(message)
            .searchTerm(searchTerm)
            .currentPage(page)
            .totalResults(0)
            .searchTime(System.currentTimeMillis() - startTime)
            .build();
        return ResponseEntity.ok(errorResponse);
    }
}
