package com.luarrezende.backend.service;

import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;
import com.luarrezende.backend.dto.MovieSummary;
import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SearchDto;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MoviesService {
    private static final int itensPerPage = 10;
    private static final int minSearchLen = 3;
    private final RestTemplate restTemplate;
    
    @Value("${omdb.api.key}")
    private String apiKey;

    @Autowired
    public MoviesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    public ResponseEntity<MovieDetailsResponse> searchMovie(String title) {
        if (!isValidSearchTerm(title)) {
            return createSearchErrorResponse();
        }

        String url = String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title.trim(), apiKey);

        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (isEmptyResponse(omdbResponse)) {
                return createMovieNotFoundResponse();
            }
            
            MovieDetailsResponse response = convertToMovieDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    public ResponseEntity<MovieSearchResponse> searchAllMovies(String title, int page) {
        long startTime = System.currentTimeMillis();
        
        if (!isValidSearchTerm(title)) {
            return createSearchAllErrorResponse(title, page, startTime, "Termo de busca muito genérico. Digite pelo menos 3 caracteres.");
        }

        if (page < 1) {
            page = 1;
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            SearchAllDto omdbResponse = restTemplate.getForObject(url, SearchAllDto.class);
            
            if (isEmptySearchResponse(omdbResponse)) {
                String errorMessage = omdbResponse != null ? "Nenhum filme encontrado" : "Erro na API do OMDB";
                return createSearchAllErrorResponse(title.trim(), page, startTime, errorMessage);
            }
            
            MovieSearchResponse response = convertToMovieSearchResponse(omdbResponse, title.trim(), page, startTime);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            MovieSearchResponse errorResponse = MovieSearchResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .searchTerm(title != null ? title.trim() : "")
                .currentPage(page)
                .totalResults(0)
                .searchTime(System.currentTimeMillis() - startTime)
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    public ResponseEntity<MovieDetailsResponse> getMovieDetails(String id, String plot) {
        String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s&plot=%s", id, apiKey, plot);
        
        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (isEmptyResponse(omdbResponse)) {
                return createMovieNotFoundResponse();
            }
            
            MovieDetailsResponse response = convertToMovieDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }
    
    private boolean isValidSearchTerm(String title) {
        return title != null && title.trim().length() >= minSearchLen;
    }
    
    private boolean isEmptyResponse(MovieDetailDto response) {
        return response == null || "False".equals(response.getResponse());
    }
    
    private boolean isEmptySearchResponse(SearchAllDto response) {
        return response == null || "False".equals(response.getResponse());
    }
    
    private MovieSearchResponse convertToMovieSearchResponse(SearchAllDto omdbDto, String searchTerm, int currentPage, long startTime) {
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
            .itemsPerPage(itensPerPage)
            .build();
    }
    
    private MovieSummary convertToMovieSummary(SearchDto searchItem) {
        return MovieSummary.builder()
            .id(searchItem.getImdbID())
            .title(searchItem.getTitle())
            .year(searchItem.getYear())
            .type(searchItem.getType())
            .poster(searchItem.getPoster())
            .available(true)
            .build();
    }

    private MovieDetailsResponse convertToMovieDetailsResponse(MovieDetailDto omdbDto) {
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
        return (int) Math.ceil((double) totalResults / itensPerPage);
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
    
    private ResponseEntity<MovieDetailsResponse> createSearchErrorResponse() {
        MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
            .success(false)
            .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
            .build();
        return ResponseEntity.badRequest().body(errorResponse);
    }
    
    private ResponseEntity<MovieDetailsResponse> createMovieNotFoundResponse() {
        MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
            .success(false)
            .errorMessage("Filme não encontrado")
            .build();
        return ResponseEntity.ok(errorResponse);
    }
    
    private ResponseEntity<MovieSearchResponse> createSearchAllErrorResponse(String searchTerm, int page, long startTime, String message) {
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
