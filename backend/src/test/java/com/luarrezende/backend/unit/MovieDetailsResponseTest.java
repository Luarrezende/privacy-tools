package com.luarrezende.backend.unit;

import com.luarrezende.backend.dto.MovieDetailsResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MovieDetailsResponseTest {

    @Test
    void deveCriarMovieDetailsResponseComBuilder() {
        // Given
        String title = "The Matrix";
        String year = "1999";
        String director = "The Wachowskis";

        // When
        MovieDetailsResponse response = MovieDetailsResponse.builder()
                .title(title)
                .year(year)
                .director(director)
                .success(true)
                .build();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo(title);
        assertThat(response.getYear()).isEqualTo(year);
        assertThat(response.getDirector()).isEqualTo(director);
        assertThat(response.isSuccess()).isTrue();
    }

    @Test
    void deveCriarRatingComBuilder() {
        // Given
        String source = "Internet Movie Database";
        String value = "8.7/10";

        // When
        MovieDetailsResponse.Rating rating = MovieDetailsResponse.Rating.builder()
                .source(source)
                .value(value)
                .build();

        // Then
        assertThat(rating).isNotNull();
        assertThat(rating.getSource()).isEqualTo(source);
        assertThat(rating.getValue()).isEqualTo(value);
    }

    @Test
    void deveTratarRespostaDeErro() {
        // Given
        String errorMessage = "Filme não encontrado!";

        // When
        MovieDetailsResponse response = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage(errorMessage)
                .build();

        // Then
        assertThat(response).isNotNull();
        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getErrorMessage()).isEqualTo(errorMessage);
    }
}
