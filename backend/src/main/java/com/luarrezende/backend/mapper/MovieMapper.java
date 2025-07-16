package com.luarrezende.backend.mapper;

import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;
import com.luarrezende.backend.dto.MovieSummary;
import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SearchDto;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovieMapper {
    
    private static final int ITEMS_PER_PAGE = 10;
    
    public MovieSearchResponse convertToMovieSearchResponse(SearchAllDto omdbDto, String searchTerm, int currentPage, long startTime) {
        int totalResults = parseIntegerSafely(omdbDto.getTotalResults());
        int totalPages = calculateTotalPages(totalResults);
        List<MovieSummary> movies = convertSearchResults(omdbDto.getSearch());
        
        return MovieSearchResponse.builder()
            .movies(movies)
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
    
    public MovieSummary convertToMovieSummary(SearchDto searchItem) {
        return MovieSummary.builder()
            .id(searchItem.getImdbID())
            .title(searchItem.getTitle())
            .year(searchItem.getYear())
            .type(searchItem.getType())
            .poster(searchItem.getPoster())
            .available(true)
            .build();
    }

    public MovieDetailsResponse convertToMovieDetailsResponse(MovieDetailDto omdbDto) {
        return MovieDetailsResponse.builder()
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
    
    private List<MovieSummary> convertSearchResults(SearchDto[] searchResults) {
        if (searchResults == null) {
            return Collections.emptyList();
        }
        
        return Arrays.stream(searchResults)
            .map(this::convertToMovieSummary)
            .collect(Collectors.toList());
    }
    
    private List<MovieDetailsResponse.Rating> convertRatings(Object[] ratings) {
        if (ratings == null) {
            return Collections.emptyList();
        }
        
        return Arrays.stream(ratings)
            .map(rating -> MovieDetailsResponse.Rating.builder()
                .source(((com.luarrezende.backend.clientdto.RatingsDto) rating).getSource())
                .value(((com.luarrezende.backend.clientdto.RatingsDto) rating).getValue())
                .build())
            .collect(Collectors.toList());
    }
}
