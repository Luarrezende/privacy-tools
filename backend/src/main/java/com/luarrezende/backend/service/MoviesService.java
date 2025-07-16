package com.luarrezende.backend.service;

import com.luarrezende.backend.dto.MovieDetailsResponse;
import com.luarrezende.backend.dto.MovieSearchResponse;
import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.mapper.MovieMapper;
import com.luarrezende.backend.mapper.ErrorResponseMapper;

import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@EnableCaching
public class MoviesService {
    private static final Logger logger = LoggerFactory.getLogger(MoviesService.class);
    private static final int minSearchLen = 3;
    private final RestTemplate restTemplate;
    private final MovieMapper movieMapper;
    private final ErrorResponseMapper errorResponseMapper;
    
    @Value("${omdb.api.key}")
    private String apiKey;

    @Autowired
    public MoviesService(RestTemplate restTemplate, MovieMapper movieMapper, ErrorResponseMapper errorResponseMapper) {
        this.restTemplate = restTemplate;
        this.movieMapper = movieMapper;
        this.errorResponseMapper = errorResponseMapper;
    }
    
    @Cacheable(value = "moviesByTitle", key = "#title != null ? #title.toLowerCase().trim() : 'null'", unless = "#result.body.success == false", cacheResolver = "cacheResolver")
    public ResponseEntity<MovieDetailsResponse> searchMovie(String title) {
        if (!isValidSearchTerm(title)) {
            return errorResponseMapper.createSearchErrorResponse();
        }
        
        logger.info("[SEARCH MOVIE] Executando busca para titulo: '{}' - CHAMANDO API EXTERNA", title.trim());

        String url = String.format("http://www.omdbapi.com/?t=%s&apikey=%s", title.trim(), apiKey);

        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (isEmptyResponse(omdbResponse)) {
                return errorResponseMapper.createMovieNotFoundResponse();
            }
            
            MovieDetailsResponse response = movieMapper.convertToMovieDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        } catch (Exception e) {
            logger.error("[SEARCH MOVIE] Erro inesperado ao buscar filme: {}", e.getMessage());
            MovieDetailsResponse errorResponse = MovieDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro interno do servidor")
                .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @Cacheable(value = "movieSearch", key = "#title != null ? (#title.toLowerCase().trim() + '_page_' + #page) : ('null_page_' + #page)", unless = "#result.body.success == false", cacheResolver = "cacheResolver")
    public ResponseEntity<MovieSearchResponse> searchAllMovies(String title, int page) {
        long startTime = System.currentTimeMillis();
        
        if (!isValidSearchTerm(title)) {
            return errorResponseMapper.createSearchAllErrorResponse(title != null ? title : "", page, startTime, "Termo de busca muito genérico. Digite pelo menos 3 caracteres.");
        }

        logger.info("[SEARCH ALL MOVIES] Executando busca para titulo: '{}', pagina: {} - CHAMANDO API EXTERNA", title.trim(), page);

        if (page < 1) {
            page = 1;
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            SearchAllDto omdbResponse = restTemplate.getForObject(url, SearchAllDto.class);
            
            if (isEmptySearchResponse(omdbResponse)) {
                String errorMessage = omdbResponse != null ? "Nenhum filme encontrado" : "Erro na API do OMDB";
                return errorResponseMapper.createSearchAllErrorResponse(title.trim(), page, startTime, errorMessage);
            }
            
            MovieSearchResponse response = movieMapper.convertToMovieSearchResponse(omdbResponse, title.trim(), page, startTime);
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

    @Cacheable(value = "moviesById", key = "#id.toLowerCase().trim() + '_' + #plot", unless = "#result.body.success == false", cacheResolver = "cacheResolver")
    public ResponseEntity<MovieDetailsResponse> getMovieDetails(String id, String plot) {
        logger.info("[MOVIE DETAILS] Executando busca para ID: '{}', plot: '{}' - CHAMANDO API EXTERNA", id.trim(), plot);
        
        String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s&plot=%s", id, apiKey, plot);
        
        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (isEmptyResponse(omdbResponse)) {
                return errorResponseMapper.createMovieNotFoundResponse();
            }
            
            MovieDetailsResponse response = movieMapper.convertToMovieDetailsResponse(omdbResponse);
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
}
