package com.luarrezende.backend.mapper;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SearchDto;
import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import com.luarrezende.backend.dto.SeriesSummary;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

class SeriesMapperTest {

    private SeriesMapper seriesMapper;

    @BeforeEach
    void setUp() {
        seriesMapper = new SeriesMapper();
    }

    @Test
    void deveConverterMovieDetailDtoParaSeriesDetailsResponse() {
        // Given
        MovieDetailDto dto = new MovieDetailDto();
        dto.setImdbID("tt0903747");
        dto.setTitle("Breaking Bad");
        dto.setYear("2008–2013");
        dto.setGenre("Crime, Drama, Thriller");
        dto.setDirector("N/A");
        dto.setPlot("A chemistry teacher diagnosed with cancer...");
        dto.setTotalSeasons("5");

        // When
        SeriesDetailsResponse response = seriesMapper.convertToSeriesDetailsResponse(dto);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo("tt0903747");
        assertThat(response.getTitle()).isEqualTo("Breaking Bad");
        assertThat(response.getYear()).isEqualTo("2008–2013");
        assertThat(response.getGenre()).isEqualTo("Crime, Drama, Thriller");
        assertThat(response.getDirector()).isEqualTo("N/A");
        assertThat(response.getPlot()).isEqualTo("A chemistry teacher diagnosed with cancer...");
        assertThat(response.getTotalSeasons()).isEqualTo("5");
        assertThat(response.isSuccess()).isTrue();
    }

    @Test
    void deveConverterSearchDtoParaSeriesSummary() {
        // Given
        SearchDto dto = new SearchDto();
        dto.setImdbID("tt0903747");
        dto.setTitle("Breaking Bad");
        dto.setYear("2008–2013");
        dto.setType("series");
        dto.setPoster("http://example.com/poster.jpg");

        // When
        SeriesSummary summary = seriesMapper.convertToSeriesSummary(dto);

        // Then
        assertThat(summary).isNotNull();
        assertThat(summary.getId()).isEqualTo("tt0903747");
        assertThat(summary.getTitle()).isEqualTo("Breaking Bad");
        assertThat(summary.getYear()).isEqualTo("2008–2013");
        assertThat(summary.getType()).isEqualTo("series");
        assertThat(summary.getPoster()).isEqualTo("http://example.com/poster.jpg");
        assertThat(summary.isAvailable()).isTrue();
    }

    @Test
    void deveConverterSearchAllDtoParaSeriesSearchResponse() {
        // Given
        SearchDto searchItem1 = new SearchDto();
        searchItem1.setImdbID("tt0903747");
        searchItem1.setTitle("Breaking Bad");
        searchItem1.setYear("2008–2013");
        searchItem1.setType("series");

        SearchDto searchItem2 = new SearchDto();
        searchItem2.setImdbID("tt1475582");
        searchItem2.setTitle("Sherlock");
        searchItem2.setYear("2010–2017");
        searchItem2.setType("series");

        SearchAllDto dto = new SearchAllDto();
        dto.setTotalResults("25");
        dto.setSearch(new SearchDto[]{searchItem1, searchItem2});

        String searchTerm = "Breaking";
        int currentPage = 1;
        long startTime = System.currentTimeMillis() - 100;

        // When
        SeriesSearchResponse response = seriesMapper.convertToSeriesSearchResponse(dto, searchTerm, currentPage, startTime);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getSearchTerm()).isEqualTo("Breaking");
        assertThat(response.getCurrentPage()).isEqualTo(1);
        assertThat(response.getTotalResults()).isEqualTo(25);
        assertThat(response.getTotalPages()).isEqualTo(3); // 25 items / 10 per page = 3 pages
        assertThat(response.isHasNextPage()).isTrue();
        assertThat(response.isHasPreviousPage()).isFalse();
        assertThat(response.getSeries()).hasSize(2);
        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getSearchTime()).isGreaterThan(0);
        assertThat(response.getItemsPerPage()).isEqualTo(10);
    }
}
