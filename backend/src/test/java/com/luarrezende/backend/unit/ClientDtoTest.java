package com.luarrezende.backend.unit;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SearchDto;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ClientDtoTest {

    @Test
    void deveCriarEManipularMovieDetailDto() {
        // Given
        MovieDetailDto dto = new MovieDetailDto();
        
        // When
        dto.setTitle("The Matrix");
        dto.setYear("1999");
        dto.setDirector("The Wachowskis");
        dto.setGenre("Action, Sci-Fi");
        dto.setPlot("A computer programmer discovers reality is a simulation");
        dto.setImdbRating("8.7");
        dto.setResponse("True");
        dto.setImdbID("tt0133093");
        dto.setActors("Keanu Reeves, Laurence Fishburne");
        dto.setRated("R");
        dto.setReleased("31 Mar 1999");
        dto.setRuntime("136 min");

        // Then
        assertThat(dto.getTitle()).isEqualTo("The Matrix");
        assertThat(dto.getYear()).isEqualTo("1999");
        assertThat(dto.getDirector()).isEqualTo("The Wachowskis");
        assertThat(dto.getGenre()).isEqualTo("Action, Sci-Fi");
        assertThat(dto.getPlot()).contains("computer programmer");
        assertThat(dto.getImdbRating()).isEqualTo("8.7");
        assertThat(dto.getResponse()).isEqualTo("True");
        assertThat(dto.getImdbID()).isEqualTo("tt0133093");
        assertThat(dto.getActors()).contains("Keanu Reeves");
        assertThat(dto.getRated()).isEqualTo("R");
        assertThat(dto.getReleased()).isEqualTo("31 Mar 1999");
        assertThat(dto.getRuntime()).isEqualTo("136 min");
    }

    @Test
    void deveCriarEManipularSearchAllDto() {
        // Given
        SearchAllDto dto = new SearchAllDto();
        SearchDto searchItem1 = new SearchDto();
        searchItem1.setTitle("The Matrix");
        searchItem1.setYear("1999");
        searchItem1.setImdbID("tt0133093");
        searchItem1.setType("movie");
        
        SearchDto searchItem2 = new SearchDto();
        searchItem2.setTitle("The Matrix Reloaded");
        searchItem2.setYear("2003");
        searchItem2.setImdbID("tt0234215");
        searchItem2.setType("movie");

        // When
        dto.setSearch(new SearchDto[]{searchItem1, searchItem2});
        dto.setTotalResults("3");
        dto.setResponse("True");

        // Then
        assertThat(dto.getSearch()).hasSize(2);
        assertThat(dto.getSearch()[0].getTitle()).isEqualTo("The Matrix");
        assertThat(dto.getSearch()[1].getTitle()).isEqualTo("The Matrix Reloaded");
        assertThat(dto.getTotalResults()).isEqualTo("3");
        assertThat(dto.getResponse()).isEqualTo("True");
    }

    @Test
    void deveCriarEManipularSearchDto() {
        // Given
        SearchDto dto = new SearchDto();

        // When
        dto.setTitle("Inception");
        dto.setYear("2010");
        dto.setImdbID("tt1375666");
        dto.setType("movie");
        dto.setPoster("http://example.com/poster.jpg");

        // Then
        assertThat(dto.getTitle()).isEqualTo("Inception");
        assertThat(dto.getYear()).isEqualTo("2010");
        assertThat(dto.getImdbID()).isEqualTo("tt1375666");
        assertThat(dto.getType()).isEqualTo("movie");
        assertThat(dto.getPoster()).isEqualTo("http://example.com/poster.jpg");
    }

    @Test
    void deveTratarRespostaDeErroNoMovieDetailDto() {
        // Given
        MovieDetailDto dto = new MovieDetailDto();

        // When
        dto.setResponse("False");
        dto.setTitle(null);

        // Then
        assertThat(dto.getResponse()).isEqualTo("False");
        assertThat(dto.getTitle()).isNull();
    }

    @Test
    void deveTratarRespostaDeErroNoSearchAllDto() {
        // Given
        SearchAllDto dto = new SearchAllDto();

        // When
        dto.setResponse("False");
        dto.setSearch(null);
        dto.setTotalResults("0");

        // Then
        assertThat(dto.getResponse()).isEqualTo("False");
        assertThat(dto.getSearch()).isNull();
        assertThat(dto.getTotalResults()).isEqualTo("0");
    }
}
