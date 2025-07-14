package com.luarrezende.backend.mapper;

import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class SeriesErrorResponseMapper {
    
    public ResponseEntity<SeriesDetailsResponse> createSearchErrorResponse() {
        SeriesDetailsResponse errorResponse = SeriesDetailsResponse.builder()
            .success(false)
            .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
            .build();
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    public ResponseEntity<SeriesDetailsResponse> createSeriesNotFoundResponse() {
        SeriesDetailsResponse errorResponse = SeriesDetailsResponse.builder()
            .success(false)
            .errorMessage("Série não encontrada")
            .build();
        return ResponseEntity.ok(errorResponse);
    }
    
    public ResponseEntity<SeriesSearchResponse> createSearchAllErrorResponse(String searchTerm, int page, long startTime, String message) {
        SeriesSearchResponse errorResponse = SeriesSearchResponse.builder()
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
