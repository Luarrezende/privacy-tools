package com.luarrezende.backend.mapper;

import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import com.luarrezende.backend.dto.SeriesSummary;
import com.luarrezende.backend.dto.EpisodeDetailsResponse;
import com.luarrezende.backend.dto.SeasonDetailsResponse;
import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SearchDto;
import com.luarrezende.backend.clientdto.SeasonDto;
import com.luarrezende.backend.clientdto.EpisodeDto;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class SeriesMapper {
    
    private static final int ITEMS_PER_PAGE = 10;
    
    public SeriesSearchResponse convertToSeriesSearchResponse(SearchAllDto omdbDto, String searchTerm, int currentPage, long startTime) {
        int totalResults = parseIntegerSafely(omdbDto.getTotalResults());
        int totalPages = calculateTotalPages(totalResults);
        List<SeriesSummary> series = convertSearchResults(omdbDto.getSearch());
        
        return SeriesSearchResponse.builder()
            .series(series)
            .totalResults(totalResults)
            .currentPage(currentPage)
            .totalPages(totalPages)
            .hasNextPage(currentPage < totalPages)
            .hasPreviousPage(currentPage > 1)
            .searchTerm(searchTerm)
            .searchType("title")
            .success(true)
            .searchTime(System.currentTimeMillis() - startTime)
            .itemsPerPage(ITEMS_PER_PAGE)
            .build();
    }
    
    public SeriesSummary convertToSeriesSummary(SearchDto searchItem) {
        return SeriesSummary.builder()
            .id(searchItem.getImdbID())
            .title(searchItem.getTitle())
            .year(searchItem.getYear())
            .type(searchItem.getType())
            .poster(searchItem.getPoster())
            .available(true)
            .build();
    }

    public SeriesDetailsResponse convertToSeriesDetailsResponse(MovieDetailDto omdbDto) {
        return SeriesDetailsResponse.builder()
            .id(omdbDto.getImdbID())
            .title(omdbDto.getTitle())
            .year(omdbDto.getYear())
            .genre(omdbDto.getGenre())
            .director(omdbDto.getDirector())
            .plot(omdbDto.getPlot())
            .rated(omdbDto.getRated())
            .runtime(omdbDto.getRuntime())
            .language(omdbDto.getLanguage())
            .country(omdbDto.getCountry())
            .actors(omdbDto.getActors())
            .writer(omdbDto.getWriter())
            .imdbRating(omdbDto.getImdbRating())
            .imdbVotes(omdbDto.getImdbVotes())
            .metascore(omdbDto.getMetascore())
            .ratings(convertRatings(omdbDto.getRatings()))
            .poster(omdbDto.getPoster())
            .awards(omdbDto.getAwards())
            .released(omdbDto.getReleased())
            .dvd(omdbDto.getDvd())
            .boxOffice(omdbDto.getBoxOffice())
            .totalSeasons(omdbDto.getTotalSeasons())
            .type(omdbDto.getType())
            .success(true)
            .build();
    }
    
    private int parseIntegerSafely(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0;
        }
    }
    
    private int calculateTotalPages(int totalResults) {
        return (int) Math.ceil((double) totalResults / ITEMS_PER_PAGE);
    }
    
    private List<SeriesSummary> convertSearchResults(SearchDto[] searchResults) {
        if (searchResults == null) {
            return Collections.emptyList();
        }
        
        return Arrays.stream(searchResults)
            .map(this::convertToSeriesSummary)
            .collect(Collectors.toList());
    }
    
    private List<SeriesDetailsResponse.Rating> convertRatings(Object[] ratings) {
        if (ratings == null) {
            return Collections.emptyList();
        }
        
        return Arrays.stream(ratings)
            .map(rating -> SeriesDetailsResponse.Rating.builder()
                .source(((com.luarrezende.backend.clientdto.RatingsDto) rating).getSource())
                .value(((com.luarrezende.backend.clientdto.RatingsDto) rating).getValue())
                .build())
            .collect(Collectors.toList());
    }

    public SeasonDetailsResponse convertToSeasonDetailsResponse(SeasonDto seasonDto) {
        List<SeasonDetailsResponse.EpisodeSummary> episodes = seasonDto.getEpisodes() != null 
            ? Arrays.stream(seasonDto.getEpisodes())
                .map(this::convertToEpisodeSummary)
                .collect(Collectors.toList())
            : Collections.emptyList();

        return SeasonDetailsResponse.builder()
                .title(seasonDto.getTitle())
                .season(seasonDto.getSeason())
                .totalSeasons(seasonDto.getTotalSeasons())
                .episodes(episodes)
                .success(true)
                .build();
    }

    private SeasonDetailsResponse.EpisodeSummary convertToEpisodeSummary(EpisodeDto episodeDto) {
        return SeasonDetailsResponse.EpisodeSummary.builder()
                .title(episodeDto.getTitle())
                .released(episodeDto.getReleased())
                .episode(episodeDto.getEpisode())
                .imdbRating(episodeDto.getImdbRating())
                .imdbID(episodeDto.getImdbID())
                .build();
    }

    public EpisodeDetailsResponse convertToEpisodeDetailsResponse(EpisodeDto episodeDto) {
        return EpisodeDetailsResponse.builder()
                .title(episodeDto.getTitle())
                .released(episodeDto.getReleased())
                .episode(episodeDto.getEpisode())
                .imdbRating(episodeDto.getImdbRating())
                .id(episodeDto.getImdbID())
                .success(true)
                .build();
    }
}
