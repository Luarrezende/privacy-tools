package com.luarrezende.backend.service;

import com.luarrezende.backend.clientdto.MovieDetailDto;
import com.luarrezende.backend.clientdto.SearchAllDto;
import com.luarrezende.backend.dto.SeriesSearchResponse;
import com.luarrezende.backend.dto.SeriesDetailsResponse;
import com.luarrezende.backend.mapper.SeriesMapper;
import com.luarrezende.backend.mapper.SeriesErrorResponseMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class SeriesServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private SeriesMapper seriesMapper;

    @Mock
    private SeriesErrorResponseMapper errorResponseMapper;

    @InjectMocks
    private SeriesService seriesService;

    @Test
    void deveBuscarSerieComSucesso() {
        String title = "Breaking Bad";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setTitle("Breaking Bad");
        mockApiResponse.setYear("2008-2013");
        mockApiResponse.setResponse("True");
        
        SeriesDetailsResponse mockMappedResponse = SeriesDetailsResponse.builder()
                .title("Breaking Bad")
                .year("2008-2013")
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(seriesMapper.convertToSeriesDetailsResponse(mockApiResponse))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = seriesService.searchSeries(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(seriesMapper).convertToSeriesDetailsResponse(mockApiResponse);
    }

    @Test
    void deveTratarErrosDaApiGraciosamente() {
        String title = "NonExistentSeries";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setResponse("False");
        
        SeriesDetailsResponse mockErrorResponse = SeriesDetailsResponse.builder()
                .success(false)
                .errorMessage("Série não encontrada")
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(errorResponseMapper.createSeriesNotFoundResponse())
                .thenReturn(ResponseEntity.ok(mockErrorResponse));

        ResponseEntity<?> result = seriesService.searchSeries(title);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(errorResponseMapper).createSeriesNotFoundResponse();
    }

    @Test
    void deveObterDetalhesSeriesPorId() {
        String seriesId = "tt0903747";
        String plot = "full";
        
        MovieDetailDto mockApiResponse = new MovieDetailDto();
        mockApiResponse.setImdbID("tt0903747");
        mockApiResponse.setTitle("Breaking Bad");
        mockApiResponse.setPlot("Full plot here");
        mockApiResponse.setResponse("True");
        
        SeriesDetailsResponse mockMappedResponse = SeriesDetailsResponse.builder()
                .id("tt0903747")
                .title("Breaking Bad")
                .plot("Full plot here")
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(MovieDetailDto.class)))
                .thenReturn(mockApiResponse);
        when(seriesMapper.convertToSeriesDetailsResponse(mockApiResponse))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = seriesService.getSeriesDetails(seriesId, plot);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(MovieDetailDto.class));
        verify(seriesMapper).convertToSeriesDetailsResponse(mockApiResponse);
    }

    @Test
    void deveBuscarTodasAsSeriesComPaginacao() {
        String title = "Breaking";
        int page = 1;
        
        SearchAllDto mockApiResponse = new SearchAllDto();
        mockApiResponse.setTotalResults("5");
        mockApiResponse.setResponse("True");
        
        SeriesSearchResponse mockMappedResponse = SeriesSearchResponse.builder()
                .searchTerm(title)
                .currentPage(page)
                .totalResults(5)
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(SearchAllDto.class)))
                .thenReturn(mockApiResponse);
        when(seriesMapper.convertToSeriesSearchResponse(eq(mockApiResponse), eq(title), eq(page), anyLong()))
                .thenReturn(mockMappedResponse);

        ResponseEntity<?> result = seriesService.searchAllSeries(title, page);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        verify(restTemplate).getForObject(anyString(), eq(SearchAllDto.class));
        verify(seriesMapper).convertToSeriesSearchResponse(eq(mockApiResponse), eq(title), eq(page), anyLong());
    }

    @Test
    void deveTratarTermoDeBuscaInvalidoMuitoCurto() {
        String shortTitle = "Br"; // Menos de 3 caracteres

        SeriesDetailsResponse mockErrorResponse = SeriesDetailsResponse.builder()
                .success(false)
                .errorMessage("Termo de busca muito genérico. Digite pelo menos 3 caracteres.")
                .build();
        
        when(errorResponseMapper.createSearchErrorResponse())
                .thenReturn(ResponseEntity.badRequest().body(mockErrorResponse));

        ResponseEntity<?> result = seriesService.searchSeries(shortTitle);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        verify(errorResponseMapper).createSearchErrorResponse();
    }

    @Test
    void deveBuscarTemporadaComSucesso() {
        String seriesId = "tt0903747";
        String season = "1";
        
        com.luarrezende.backend.clientdto.SeasonDto mockApiResponse = new com.luarrezende.backend.clientdto.SeasonDto();
        mockApiResponse.setTitle("Breaking Bad");
        mockApiResponse.setSeason("1");
        mockApiResponse.setResponse("True");
        
        com.luarrezende.backend.dto.SeasonDetailsResponse mockMappedResponse = com.luarrezende.backend.dto.SeasonDetailsResponse.builder()
                .title("Breaking Bad")
                .season("1")
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(com.luarrezende.backend.clientdto.SeasonDto.class)))
                .thenReturn(mockApiResponse);
        when(seriesMapper.convertToSeasonDetailsResponse(mockApiResponse))
                .thenReturn(mockMappedResponse);

        ResponseEntity<com.luarrezende.backend.dto.SeasonDetailsResponse> result = seriesService.getSeasonDetails(seriesId, season);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getTitle()).isEqualTo("Breaking Bad");
        assertThat(result.getBody().getSeason()).isEqualTo("1");
        verify(seriesMapper).convertToSeasonDetailsResponse(mockApiResponse);
    }

    @Test
    void deveBuscarEpisodioComSucesso() {
        String seriesId = "tt0903747";
        String season = "1";
        String episode = "3";
        
        com.luarrezende.backend.clientdto.EpisodeDto mockApiResponse = new com.luarrezende.backend.clientdto.EpisodeDto();
        mockApiResponse.setTitle("And the Bag's in the River");
        mockApiResponse.setEpisode("3");
        mockApiResponse.setImdbRating("8.1");
        
        com.luarrezende.backend.dto.EpisodeDetailsResponse mockMappedResponse = com.luarrezende.backend.dto.EpisodeDetailsResponse.builder()
                .title("And the Bag's in the River")
                .episode("3")
                .imdbRating("8.1")
                .success(true)
                .build();
        
        when(restTemplate.getForObject(anyString(), eq(com.luarrezende.backend.clientdto.EpisodeDto.class)))
                .thenReturn(mockApiResponse);
        when(seriesMapper.convertToEpisodeDetailsResponse(mockApiResponse))
                .thenReturn(mockMappedResponse);

        ResponseEntity<com.luarrezende.backend.dto.EpisodeDetailsResponse> result = seriesService.getEpisodeDetails(seriesId, season, episode);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getTitle()).isEqualTo("And the Bag's in the River");
        assertThat(result.getBody().getEpisode()).isEqualTo("3");
        verify(seriesMapper).convertToEpisodeDetailsResponse(mockApiResponse);
    }

    @Test
    void deveRetornarErroQuandoTemporadaNaoEncontrada() {
        String seriesId = "tt0903747";
        String season = "99";
        
        com.luarrezende.backend.clientdto.SeasonDto mockApiResponse = new com.luarrezende.backend.clientdto.SeasonDto();
        mockApiResponse.setResponse("False");
        
        when(restTemplate.getForObject(anyString(), eq(com.luarrezende.backend.clientdto.SeasonDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<com.luarrezende.backend.dto.SeasonDetailsResponse> result = seriesService.getSeasonDetails(seriesId, season);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getErrorMessage()).isEqualTo("Temporada não encontrada");
    }

    @Test
    void deveRetornarErroQuandoEpisodioNaoEncontrado() {
        String seriesId = "tt0903747";
        String season = "1";
        String episode = "99";
        
        com.luarrezende.backend.clientdto.EpisodeDto mockApiResponse = new com.luarrezende.backend.clientdto.EpisodeDto();
        // Título null indica que não foi encontrado
        mockApiResponse.setTitle(null);
        
        when(restTemplate.getForObject(anyString(), eq(com.luarrezende.backend.clientdto.EpisodeDto.class)))
                .thenReturn(mockApiResponse);

        ResponseEntity<com.luarrezende.backend.dto.EpisodeDetailsResponse> result = seriesService.getEpisodeDetails(seriesId, season, episode);

        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getErrorMessage()).isEqualTo("Episódio não encontrado");
    }
}
