package com.luarrezende.backend.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "app.omdb.api.url=http://localhost:8080/mock-api",
    "app.omdb.api.key=test-key"
})
class MoviesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void deveTratarParametroTitleAusente() throws Exception {
        mockMvc.perform(get("/api/movies/search"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveTratarParametroTitleVazio() throws Exception {
        mockMvc.perform(get("/api/movies/search")
                .param("title", ""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveAceitarRequisicaoDeBuscaValida() throws Exception {
        mockMvc.perform(get("/api/movies/search")
                .param("title", "Matrix"))
                .andExpect(status().isOk());
    }

    @Test
    void deveTratarPaginacaoCorretamente() throws Exception {
        mockMvc.perform(get("/api/movies/searchall")
                .param("title", "Matrix")
                .param("page", "2"))
                .andExpect(status().isOk());
    }

    @Test
    void deveUsarPaginaPadraoQuandoNaoFornecida() throws Exception {
        mockMvc.perform(get("/api/movies/searchall")
                .param("title", "Matrix"))
                .andExpect(status().isOk());
    }

    @Test
    void deveObterDetalhesDoFilmeComPlotPadrao() throws Exception {
        mockMvc.perform(get("/api/movies/details")
                .param("id", "tt0133093"))
                .andExpect(status().isOk());
    }

    @Test
    void deveObterDetalhesDoFilmeComPlotCompleto() throws Exception {
        mockMvc.perform(get("/api/movies/details")
                .param("id", "tt0133093")
                .param("plot", "full"))
                .andExpect(status().isOk());
    }
}
