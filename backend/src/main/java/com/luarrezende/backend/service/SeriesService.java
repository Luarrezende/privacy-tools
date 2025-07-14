package com.luarrezende.backend.service;

import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import com.luarrezende.backend.dto.SeasonDetailsResponse;
import com.luarrezende.backend.dto.EpisodeDetailsResponse;
import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.clientdto.SeasonDto;
import com.luarrezende.backend.clientdto.EpisodeDto;
import com.luarrezende.backend.mapper.SeriesMapper;
import com.luarrezende.backend.mapper.SeriesErrorResponseMapper;

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
public class SeriesService {
    private static final Logger logger = LoggerFactory.getLogger(SeriesService.class);
    private static final int minSearchLen = 3;
    private final RestTemplate restTemplate;
    private final SeriesMapper seriesMapper;
    private final SeriesErrorResponseMapper errorResponseMapper;
    
    @Value("${omdb.api.key}")
    private String apiKey;

    @Autowired
    public SeriesService(RestTemplate restTemplate, SeriesMapper seriesMapper, SeriesErrorResponseMapper errorResponseMapper) {
        this.restTemplate = restTemplate;
        this.seriesMapper = seriesMapper;
        this.errorResponseMapper = errorResponseMapper;
    }
    
    @Cacheable(value = "seriesByTitle", key = "#title != null ? #title.toLowerCase().trim() : 'null'", unless = "#result.body.success == false", cacheResolver = "cacheResolver")
    public ResponseEntity<SeriesDetailsResponse> searchSeries(String title) {
        if (!isValidSearchTerm(title)) {
            return errorResponseMapper.createSearchErrorResponse();
        }
        
        logger.info("[SEARCH SERIES] Executando busca para titulo: '{}' - CHAMANDO API EXTERNA", title.trim());

        String url = String.format("http://www.omdbapi.com/?t=%s&type=series&apikey=%s", title.trim(), apiKey);

        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (isEmptyResponse(omdbResponse)) {
                return errorResponseMapper.createSeriesNotFoundResponse();
            }
            
            SeriesDetailsResponse response = seriesMapper.convertToSeriesDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            SeriesDetailsResponse errorResponse = SeriesDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        } catch (Exception e) {
            logger.error("[SEARCH SERIES] Erro inesperado ao buscar série: {}", e.getMessage());
            SeriesDetailsResponse errorResponse = SeriesDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro interno do servidor")
                .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @Cacheable(value = "seriesSearch", key = "#title != null ? (#title.toLowerCase().trim() + '_page_' + #page) : ('null_page_' + #page)", unless = "#result.body.success == false", cacheResolver = "cacheResolver")
    public ResponseEntity<SeriesSearchResponse> searchAllSeries(String title, int page) {
        long startTime = System.currentTimeMillis();
        
        if (!isValidSearchTerm(title)) {
            return errorResponseMapper.createSearchAllErrorResponse(title != null ? title : "", page, startTime, "Termo de busca muito genérico. Digite pelo menos 3 caracteres.");
        }

        logger.info("[SEARCH ALL SERIES] Executando busca para titulo: '{}', pagina: {} - CHAMANDO API EXTERNA", title.trim(), page);

        if (page < 1) {
            page = 1;
        }

        String url = String.format("http://www.omdbapi.com/?s=%s&type=series&apikey=%s&page=%d", title.trim(), apiKey, page);

        try {
            SearchAllDto omdbResponse = restTemplate.getForObject(url, SearchAllDto.class);
            
            if (isEmptySearchResponse(omdbResponse)) {
                String errorMessage = omdbResponse != null ? "Nenhuma série encontrada" : "Erro na API do OMDB";
                return errorResponseMapper.createSearchAllErrorResponse(title.trim(), page, startTime, errorMessage);
            }
            
            SeriesSearchResponse response = seriesMapper.convertToSeriesSearchResponse(omdbResponse, title.trim(), page, startTime);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            SeriesSearchResponse errorResponse = SeriesSearchResponse.builder()
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

    @Cacheable(value = "seriesById", key = "#id.toLowerCase().trim() + '_' + #plot", unless = "#result.body.success == false", cacheResolver = "cacheResolver")
    public ResponseEntity<SeriesDetailsResponse> getSeriesDetails(String id, String plot) {
        logger.info("[SERIES DETAILS] Executando busca para ID: '{}', plot: '{}' - CHAMANDO API EXTERNA", id.trim(), plot);
        
        String url = String.format("http://www.omdbapi.com/?i=%s&apikey=%s&plot=%s", id, apiKey, plot);
        
        try {
            MovieDetailDto omdbResponse = restTemplate.getForObject(url, MovieDetailDto.class);
            
            if (isEmptyResponse(omdbResponse)) {
                return errorResponseMapper.createSeriesNotFoundResponse();
            }
            
            SeriesDetailsResponse response = seriesMapper.convertToSeriesDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            SeriesDetailsResponse errorResponse = SeriesDetailsResponse.builder()
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

    @Cacheable(value = "seriesSeason", key = "#seriesId + '_' + #season")
    public ResponseEntity<SeasonDetailsResponse> getSeasonDetails(String seriesId, String season) {
        long startTime = System.currentTimeMillis();
        logger.info("[SEASON DETAILS] Buscando detalhes da temporada {} da série: {} - INICIANDO BUSCA EM CACHE", season, seriesId);

        String url = String.format("http://www.omdbapi.com/?i=%s&Season=%s&apikey=%s", seriesId, season, apiKey);

        try {
            SeasonDto omdbResponse = restTemplate.getForObject(url, SeasonDto.class);
            
            if (omdbResponse == null || "False".equals(omdbResponse.getResponse())) {
                SeasonDetailsResponse errorResponse = SeasonDetailsResponse.builder()
                    .success(false)
                    .errorMessage("Temporada não encontrada")
                    .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("[SEASON DETAILS] Temporada {} da série {} encontrada - Tempo de resposta: {}ms", season, seriesId, System.currentTimeMillis() - startTime);
            
            SeasonDetailsResponse response = seriesMapper.convertToSeasonDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            SeasonDetailsResponse errorResponse = SeasonDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }

    @Cacheable(value = "seriesEpisode", key = "#seriesId + '_' + #season + '_' + #episode")
    public ResponseEntity<EpisodeDetailsResponse> getEpisodeDetails(String seriesId, String season, String episode) {
        long startTime = System.currentTimeMillis();
        logger.info("[EPISODE DETAILS] Buscando detalhes do episódio {} da temporada {} da série: {} - INICIANDO BUSCA EM CACHE", episode, season, seriesId);

        String url = String.format("http://www.omdbapi.com/?i=%s&Season=%s&Episode=%s&apikey=%s", seriesId, season, episode, apiKey);

        try {
            EpisodeDto omdbResponse = restTemplate.getForObject(url, EpisodeDto.class);
            
            if (omdbResponse == null || omdbResponse.getTitle() == null) {
                EpisodeDetailsResponse errorResponse = EpisodeDetailsResponse.builder()
                    .success(false)
                    .errorMessage("Episódio não encontrado")
                    .build();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("[EPISODE DETAILS] Episódio {} da temporada {} da série {} encontrado - Tempo de resposta: {}ms", episode, season, seriesId, System.currentTimeMillis() - startTime);
            
            EpisodeDetailsResponse response = seriesMapper.convertToEpisodeDetailsResponse(omdbResponse);
            return ResponseEntity.ok(response);
            
        } catch (HttpClientErrorException e) {
            EpisodeDetailsResponse errorResponse = EpisodeDetailsResponse.builder()
                .success(false)
                .errorMessage("Erro na comunicação com a API: " + e.getMessage())
                .build();
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        }
    }
}
