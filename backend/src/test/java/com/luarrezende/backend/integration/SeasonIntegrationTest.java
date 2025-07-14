package com.luarrezende.backend.integration;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.web.client.RestTemplate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SeasonIntegrationTest {

    @LocalServerPort
    private int port;

    private final RestTemplate restTemplate = new RestTemplate();

    @Test
    void deveRetornarDadosCorretosParaTemporadaBreakingBad() {
        String url = String.format("http://localhost:%d/api/series/season?seriesId=tt0903747&season=1", port);
        
        String response = restTemplate.getForObject(url, String.class);
        
        assertThat(response).isNotNull();
        assertThat(response).contains("\"success\":true");
        assertThat(response).contains("Breaking Bad");
        
        System.out.println("Resposta completa da API:");
        System.out.println(response);
    }
}
