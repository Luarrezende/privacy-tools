package com.luarrezende.backend.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.io.StringWriter;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class RateLimitInterceptorTest {

    private RateLimitInterceptor rateLimitInterceptor;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private Object handler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        rateLimitInterceptor = new RateLimitInterceptor();
    }

    @Test
    void devePermitirRequisicoesDentroDoLimite() throws Exception {
        boolean result = rateLimitInterceptor.preHandle(request, response, handler);

        assertThat(result).isTrue();
        verify(response, never()).setStatus(anyInt());
    }

    @Test
    void deveBloquearRequisicaoQuandoExcederLimite() throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // Simula 101 requisições para exceder o limite de 100
        for (int i = 0; i < 101; i++) {
            rateLimitInterceptor.preHandle(request, response, handler);
        }

        verify(response, atLeastOnce()).setStatus(429);
        verify(response, atLeastOnce()).getWriter();
        
        String responseContent = stringWriter.toString();
        assertThat(responseContent).contains("429 - Muitas requisições em um minuto.");
    }

    @Test
    void deveRetornarFalseQuandoLimiteExcedido() throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // Consome todo o limite primeiro
        for (int i = 0; i < 100; i++) {
            rateLimitInterceptor.preHandle(request, response, handler);
        }

        // A próxima requisição deve ser bloqueada
        boolean result = rateLimitInterceptor.preHandle(request, response, handler);

        assertThat(result).isFalse();
    }

    @Test
    void deveDefinirStatusCode429QuandoLimiteExcedido() throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // Consome todo o limite
        for (int i = 0; i < 100; i++) {
            rateLimitInterceptor.preHandle(request, response, handler);
        }

        // Tenta uma requisição adicional
        rateLimitInterceptor.preHandle(request, response, handler);

        verify(response).setStatus(429);
    }

    @Test
    void deveEscreverMensagemDeErroQuandoLimiteExcedido() throws Exception {
        StringWriter stringWriter = new StringWriter();
        PrintWriter printWriter = new PrintWriter(stringWriter);
        when(response.getWriter()).thenReturn(printWriter);

        // Consome todo o limite
        for (int i = 0; i < 100; i++) {
            rateLimitInterceptor.preHandle(request, response, handler);
        }

        // Tenta uma requisição adicional
        rateLimitInterceptor.preHandle(request, response, handler);

        String responseContent = stringWriter.toString();
        assertThat(responseContent).isEqualTo("429 - Muitas requisições em um minuto.");
    }

    @Test
    void devePermitirMultiplasRequisicoesDentroDoLimite() throws Exception {
        // Testa 50 requisições, que deve estar dentro do limite
        for (int i = 0; i < 50; i++) {
            boolean result = rateLimitInterceptor.preHandle(request, response, handler);
            assertThat(result).isTrue();
        }

        verify(response, never()).setStatus(anyInt());
    }
}
