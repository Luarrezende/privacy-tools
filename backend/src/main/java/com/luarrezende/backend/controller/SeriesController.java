package com.luarrezende.backend.controller;

import com.luarrezende.backend.service.SeriesService;
import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import com.luarrezende.backend.dto.SeasonDetailsResponse;
import com.luarrezende.backend.dto.EpisodeDetailsResponse;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/series")
@Tag(name = "Series", description = "API para busca e obtenção de detalhes de séries")
public class SeriesController {
    
    private final SeriesService seriesService;

    public SeriesController(SeriesService seriesService) {
        this.seriesService = seriesService;
    }

    @GetMapping("/search")
    @Operation(
        summary = "Buscar série por título",
        description = "Busca uma série específica pelo título e retorna os detalhes completos"
    )
    public ResponseEntity<SeriesDetailsResponse> searchSeries(
        @Parameter(description = "Título da série a ser buscada", required = true, example = "Breaking Bad")
        @RequestParam String title) {
        return seriesService.searchSeries(title);
    }

    @GetMapping("/searchall")
    @Operation(
        summary = "Buscar todas as séries por título",
        description = "Busca todas as séries que correspondem ao título especificado com suporte a paginação"
    )
    public ResponseEntity<SeriesSearchResponse> searchAllSeries(
            @Parameter(description = "Título da série a ser buscada", required = true, example = "Breaking")
            @RequestParam String title, 
            @Parameter(description = "Número da página para paginação", required = false, example = "1")
            @RequestParam(defaultValue = "1") int page) {
        return seriesService.searchAllSeries(title, page);
    }

    @GetMapping("/details")
    @Operation(
        summary = "Obter detalhes da série",
        description = "Obtém os detalhes completos de uma série específica usando seu ID"
    )
    public ResponseEntity<SeriesDetailsResponse> getSeriesDetails(
            @Parameter(description = "ID único da série", required = true, example = "tt0903747")
            @RequestParam String id, 
            @Parameter(description = "Tipo de sinopse a ser retornada", required = false, example = "full")
            @RequestParam(defaultValue = "short") String plot) {
        return seriesService.getSeriesDetails(id, plot);
    }

    @GetMapping("/season")
    @Operation(
        summary = "Obter detalhes da temporada",
        description = "Obtém os detalhes de uma temporada específica de uma série, incluindo lista de episódios"
    )
    public ResponseEntity<SeasonDetailsResponse> getSeasonDetails(
            @Parameter(description = "ID único da série", required = true, example = "tt0903747")
            @RequestParam String seriesId,
            @Parameter(description = "Número da temporada", required = true, example = "1")
            @RequestParam String season) {
        return seriesService.getSeasonDetails(seriesId, season);
    }

    @GetMapping("/episode")
    @Operation(
        summary = "Obter detalhes do episódio",
        description = "Obtém os detalhes de um episódio específico de uma série"
    )
    public ResponseEntity<EpisodeDetailsResponse> getEpisodeDetails(
            @Parameter(description = "ID único da série", required = true, example = "tt0903747")
            @RequestParam String seriesId,
            @Parameter(description = "Número da temporada", required = true, example = "1")
            @RequestParam String season,
            @Parameter(description = "Número do episódio", required = true, example = "3")
            @RequestParam String episode) {
        return seriesService.getEpisodeDetails(seriesId, season, episode);
    }
}
