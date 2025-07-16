package com.luarrezende.backend.controller;

import com.luarrezende.backend.service.SeriesService;
import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import com.luarrezende.backend.dto.SeasonDetailsResponse;
import com.luarrezende.backend.dto.EpisodeDetailsResponse;
import com.luarrezende.backend.config.SecurityConfig;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SeriesController.class)
@Import(SecurityConfig.class)
class SeriesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SeriesService seriesService;

    @Test
    void deveBuscarSerieComSucesso() throws Exception {
        SeriesDetailsResponse mockResponse = SeriesDetailsResponse.builder()
                .title("Breaking Bad")
                .year("2008-2013")
                .success(true)
                .build();

        when(seriesService.searchSeries(anyString()))
                .thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/series/search")
                .param("title", "Breaking Bad")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Breaking Bad"))
                .andExpect(jsonPath("$.year").value("2008-2013"))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deveBuscarTodasAsSeriesComSucesso() throws Exception {
        SeriesSearchResponse mockResponse = SeriesSearchResponse.builder()
                .success(true)
                .totalResults(50)
                .currentPage(1)
                .totalPages(5)
                .build();

        when(seriesService.searchAllSeries(anyString(), any(Integer.class)))
                .thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/series/searchall")
                .param("title", "Breaking")
                .param("page", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.totalResults").value(50))
                .andExpect(jsonPath("$.currentPage").value(1));
    }

    @Test
    void deveObterDetalhesComSucesso() throws Exception {
        SeriesDetailsResponse mockResponse = SeriesDetailsResponse.builder()
                .id("tt0903747")
                .title("Breaking Bad")
                .year("2008-2013")
                .success(true)
                .build();

        when(seriesService.getSeriesDetails(anyString(), anyString()))
                .thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/series/details")
                .param("id", "tt0903747")
                .param("plot", "short")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("tt0903747"))
                .andExpect(jsonPath("$.title").value("Breaking Bad"))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deveObterDetalhesTemporadaComSucesso() throws Exception {
        SeasonDetailsResponse mockResponse = SeasonDetailsResponse.builder()
                .title("Breaking Bad")
                .season("1")
                .totalSeasons("5")
                .success(true)
                .build();

        when(seriesService.getSeasonDetails(anyString(), anyString()))
                .thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/series/season")
                .param("seriesId", "tt0903747")
                .param("season", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Breaking Bad"))
                .andExpect(jsonPath("$.season").value("1"))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deveObterDetalhesEpisodioComSucesso() throws Exception {
        EpisodeDetailsResponse mockResponse = EpisodeDetailsResponse.builder()
                .title("And the Bag's in the River")
                .episode("3")
                .season("1")
                .imdbRating("8.1")
                .success(true)
                .build();

        when(seriesService.getEpisodeDetails(anyString(), anyString(), anyString()))
                .thenReturn(ResponseEntity.ok(mockResponse));

        mockMvc.perform(get("/api/series/episode")
                .param("seriesId", "tt0903747")
                .param("season", "1")
                .param("episode", "3")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("And the Bag's in the River"))
                .andExpect(jsonPath("$.episode").value("3"))
                .andExpect(jsonPath("$.season").value("1"))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void deveRetornarErroQuandoParametroObrigatorioFaltando() throws Exception {
        mockMvc.perform(get("/api/series/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/series/season")
                .param("seriesId", "tt0903747")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        mockMvc.perform(get("/api/series/episode")
                .param("seriesId", "tt0903747")
                .param("season", "1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
