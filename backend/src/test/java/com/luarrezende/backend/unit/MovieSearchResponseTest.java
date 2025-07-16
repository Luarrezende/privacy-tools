package com.luarrezende.backend.unit;

import com.luarrezende.backend.dto.MovieSearchResponse;
import com.luarrezende.backend.dto.MovieSummary;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class MovieSearchResponseTest {

    @Test
    void deveCriarMovieSearchResponseComBuilder() {

        String searchTerm = "Matrix";
        int currentPage = 1;
        int totalResults = 3;
        boolean success = true;
        
        MovieSummary movie1 = MovieSummary.builder()
                .title("The Matrix")
                .year("1999")
                .id("tt0133093")
                .build();
        
        List<MovieSummary> movies = Arrays.asList(movie1);

        MovieSearchResponse response = MovieSearchResponse.builder()
                .searchTerm(searchTerm)
                .currentPage(currentPage)
                .totalResults(totalResults)
                .movies(movies)
                .success(success)
                .build();

        assertThat(response).isNotNull();
        assertThat(response.getSearchTerm()).isEqualTo(searchTerm);
        assertThat(response.getCurrentPage()).isEqualTo(currentPage);
        assertThat(response.getTotalResults()).isEqualTo(totalResults);
        assertThat(response.getMovies()).hasSize(1);
        assertThat(response.getMovies().get(0).getTitle()).isEqualTo("The Matrix");
        assertThat(response.isSuccess()).isTrue();
    }

    @Test
    void deveCriarMovieSearchResponseDeErro() {
        String errorMessage = "Busca falhou";
        boolean success = false;

        MovieSearchResponse response = MovieSearchResponse.builder()
                .success(success)
                .errorMessage(errorMessage)
                .totalResults(0)
                .build();

        assertThat(response).isNotNull();
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getErrorMessage()).isEqualTo(errorMessage);
        assertThat(response.getTotalResults()).isEqualTo(0);
    }

    @Test
    void deveTestarEqualsEHashCode() {
        MovieSearchResponse response1 = MovieSearchResponse.builder()
                .searchTerm("Matrix")
                .currentPage(1)
                .totalResults(3)
                .success(true)
                .build();

        MovieSearchResponse response2 = MovieSearchResponse.builder()
                .searchTerm("Matrix")
                .currentPage(1)
                .totalResults(3)
                .success(true)
                .build();

        assertThat(response1).isEqualTo(response2);
        assertThat(response1.hashCode()).isEqualTo(response2.hashCode());
    }

    @Test
    void deveTestarToString() {
        MovieSearchResponse response = MovieSearchResponse.builder()
                .searchTerm("Matrix")
                .success(true)
                .build();

        String toString = response.toString();

        assertThat(toString).contains("Matrix");
        assertThat(toString).contains("success=true");
    }
}
