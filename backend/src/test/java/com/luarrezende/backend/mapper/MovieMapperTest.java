package com.luarrezende.backend.mapper;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SearchDto;
import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;
import com.luarrezende.backend.dto.MovieSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class MovieMapperTest {

    private MovieMapper movieMapper;

    @BeforeEach
    void setUp() {
        movieMapper = new MovieMapper();
    }

    @Test
    void deveConverterMovieDetailDtoParaMovieDetailsResponse() {
        // Given
        MovieDetailDto dto = new MovieDetailDto();
        dto.setImdbID("tt0133093");
        dto.setTitle("The Matrix");
        dto.setYear("1999");
        dto.setGenre("Action, Sci-Fi");
        dto.setDirector("The Wachowskis");
        dto.setPlot("A computer hacker learns from mysterious rebels...");

        // When
        MovieDetailsResponse response = movieMapper.convertToMovieDetailsResponse(dto);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("tt0133093");
        assertThat(response.getTitle()).isEqualTo("The Matrix");
        assertThat(response.getYear()).isEqualTo("1999");
        assertThat(response.getGenre()).isEqualTo("Action, Sci-Fi");
        assertThat(response.getDirector()).isEqualTo("The Wachowskis");
        assertThat(response.getPlot()).isEqualTo("A computer hacker learns from mysterious rebels...");
        assertThat(response.isSuccess()).isTrue();
    }

    @Test
    void deveConverterSearchDtoParaMovieSummary() {
        // Given
        SearchDto dto = new SearchDto();
        dto.setImdbID("tt0133093");
        dto.setTitle("The Matrix");
        dto.setYear("1999");
        dto.setType("movie");
        dto.setPoster("http://example.com/poster.jpg");

        // When
        MovieSummary summary = movieMapper.convertToMovieSummary(dto);

        // Then
        assertThat(summary).isNotNull();
        assertThat(summary.getId()).isEqualTo("tt0133093");
        assertThat(summary.getTitle()).isEqualTo("The Matrix");
        assertThat(summary.getYear()).isEqualTo("1999");
        assertThat(summary.getType()).isEqualTo("movie");
        assertThat(summary.getPoster()).isEqualTo("http://example.com/poster.jpg");
        assertThat(summary.isAvailable()).isTrue();
    }

    @Test
    void deveConverterSearchAllDtoParaMovieSearchResponse() {
        // Given
        SearchDto searchItem1 = new SearchDto();
        searchItem1.setImdbID("tt0133093");
        searchItem1.setTitle("The Matrix");
        searchItem1.setYear("1999");
        searchItem1.setType("movie");

        SearchDto searchItem2 = new SearchDto();
        searchItem2.setImdbID("tt0234215");
        searchItem2.setTitle("The Matrix Reloaded");
        searchItem2.setYear("2003");
        searchItem2.setType("movie");

        SearchAllDto dto = new SearchAllDto();
        dto.setTotalResults("23");
        dto.setSearch(new SearchDto[]{searchItem1, searchItem2});

        String searchTerm = "Matrix";
        int currentPage = 1;
        long startTime = System.currentTimeMillis() - 100;

        // When
        MovieSearchResponse response = movieMapper.convertToMovieSearchResponse(dto, searchTerm, currentPage, startTime);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getSearchTerm()).isEqualTo("Matrix");
        assertThat(response.getCurrentPage()).isEqualTo(1);
        assertThat(response.getTotalResults()).isEqualTo(23);
        assertThat(response.getTotalPages()).isEqualTo(3); // 23 items / 10 per page = 3 pages
        assertThat(response.isHasNextPage()).isTrue();
        assertThat(response.isHasPreviousPage()).isFalse();
        assertThat(response.getMovies()).hasSize(2);
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getSearchTime()).isGreaterThan(0);
        assertThat(response.getItemsPerPage()).isEqualTo(10);
    }
}
