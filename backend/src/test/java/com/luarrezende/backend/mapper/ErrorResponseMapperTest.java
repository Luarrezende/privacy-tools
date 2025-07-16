package com.luarrezende.backend.mapper;

import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class ErrorResponseMapperTest {

    private ErrorResponseMapper errorResponseMapper;

    @BeforeEach
    void setUp() {
        errorResponseMapper = new ErrorResponseMapper();
    }

    @Test
    void deveCriarSearchErrorResponse() {
        // When
        ResponseEntity<MovieDetailsResponse> response = errorResponseMapper.createSearchErrorResponse();

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isFalse();
        assertThat(response.getBody().getErrorMessage()).isEqualTo("Termo de busca muito genérico. Digite pelo menos 3 caracteres.");
    }

    @Test
    void deveCriarMovieNotFoundResponse() {
        // When
        ResponseEntity<MovieDetailsResponse> response = errorResponseMapper.createMovieNotFoundResponse();

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isFalse();
        assertThat(response.getBody().getErrorMessage()).isEqualTo("Filme não encontrado");
    }

    @Test
    void deveCriarSearchAllErrorResponse() {
        // Given
        String searchTerm = "test";
        int page = 1;
        long startTime = System.currentTimeMillis() - 100;
        String message = "Nenhum filme encontrado";

        // When
        ResponseEntity<MovieSearchResponse> response = errorResponseMapper.createSearchAllErrorResponse(searchTerm, page, startTime, message);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().isSuccess()).isFalse();
        assertThat(response.getBody().getErrorMessage()).isEqualTo(message);
        assertThat(response.getBody().getSearchTerm()).isEqualTo(searchTerm);
        assertThat(response.getBody().getCurrentPage()).isEqualTo(page);
        assertThat(response.getBody().getTotalResults()).isEqualTo(0);
        assertThat(response.getBody().getSearchTime()).isGreaterThan(0);
    }
}
