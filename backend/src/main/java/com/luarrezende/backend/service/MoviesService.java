package com.luarrezende.backend.service;

import com.luarrezende.backend.dto.ErrorResponse;
import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;

import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class MoviesService {
    private final RestTemplate restTemplate;

    @Value("${omdb.api.key}")
    private String apiKey;

    @Autowired
    public MoviesService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<?> searchMovie(String title) {
        if (title == null || title.trim().length() < 3) {
            ErrorResponse error = new ErrorResponse(
                "Termo de busca muito genérico. Digite pelo menos 3 caracteres.",
                HttpStatus.BAD_REQUEST.value()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        String url = String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title.trim(), apiKey);

        try {
            MovieDetailDto response = restTemplate.getForObject(url, MovieDetailDto.class);
            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            ErrorResponse error = new ErrorResponse(e.getResponseBodyAsString(), e.getStatusCode().value());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        }
    }

    public ResponseEntity<?> searchAllMovies(String title, int page) {
        if (title == null || title.trim().length() < 3) {
            ErrorResponse error = new ErrorResponse(
                "Termo de busca muito genérico. Digite pelo menos 3 caracteres.",
                HttpStatus.BAD_REQUEST.value()
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }

        if (page < 1) {
            page = 1;
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            SearchAllDto response = restTemplate.getForObject(url, SearchAllDto.class);
            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            ErrorResponse error = new ErrorResponse(e.getResponseBodyAsString(), e.getStatusCode().value());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        }
    }

    public ResponseEntity<?> getMovieDetails(String id, String plot) {
        String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s&plot=%s", id, apiKey, plot);
        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (omdbResponse == null || "False".equals(omdbResponse.getResponse())) {
                MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
                    .success(false)
                    .errorMessage(omdbResponse != null ? "Filme não encontrado" : "Sem resposta da OMDB API")
                    .build();
                return ResponseEntity.ok(errorResponse);
            }
            
            MovieDetailsResponse response = convertToMovieDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            ErrorResponse error = new ErrorResponse(e.getResponseBodyAsString(), e.getStatusCode().value());
            return ResponseEntity.status(e.getStatusCode()).body(error);
        }
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
            .ratings(omdbDto.getRatings() != null ? 
                Arrays.stream(omdbDto.getRatings())
                    .map(rating -> MovieDetailsResponse.Rating.builder()
                        .source(rating.getSource())
                        .value(rating.getValue())
                        .build())
                    .collect(Collectors.toList()) 
                : Collections.emptyList())
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
}
