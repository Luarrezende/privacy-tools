package com.luarrezende.backend.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ErrorResponseTest {

    @Test
    void deveCriarErrorResponseComConstrutorCompleto() {
        String mensagem = "Erro ao processar solicitação";
        int codigoErro = 500;

        ErrorResponse errorResponse = new ErrorResponse(mensagem, codigoErro);

        assertThat(errorResponse.getMessage()).isEqualTo(mensagem);
        assertThat(errorResponse.getErrorCode()).isEqualTo(codigoErro);
    }

    @Test
    void devePermitirAlterarMensagemAtravesDoSetter() {
        ErrorResponse errorResponse = new ErrorResponse("Mensagem inicial", 400);
        String novaMensagem = "Nova mensagem de erro";

        errorResponse.setMessage(novaMensagem);

        assertThat(errorResponse.getMessage()).isEqualTo(novaMensagem);
    }

    @Test
    void devePermitirAlterarCodigoErroAtravesDoSetter() {
        ErrorResponse errorResponse = new ErrorResponse("Erro", 400);
        int novoCodigoErro = 404;

        errorResponse.setErrorCode(novoCodigoErro);

        assertThat(errorResponse.getErrorCode()).isEqualTo(novoCodigoErro);
    }

    @Test
    void deveImplementarEqualsEHashCodeCorretamente() {
        String mensagem = "Erro de validação";
        int codigoErro = 422;
        ErrorResponse errorResponse1 = new ErrorResponse(mensagem, codigoErro);
        ErrorResponse errorResponse2 = new ErrorResponse(mensagem, codigoErro);
        ErrorResponse errorResponse3 = new ErrorResponse("Outra mensagem", 500);

        assertThat(errorResponse1).isEqualTo(errorResponse2);
        assertThat(errorResponse1).isNotEqualTo(errorResponse3);
        assertThat(errorResponse1.hashCode()).isEqualTo(errorResponse2.hashCode());
        assertThat(errorResponse1.hashCode()).isNotEqualTo(errorResponse3.hashCode());
    }

    @Test
    void deveImplementarToStringCorretamente() {
        String mensagem = "Token inválido";
        int codigoErro = 401;
        ErrorResponse errorResponse = new ErrorResponse(mensagem, codigoErro);

        String toString = errorResponse.toString();

        assertThat(toString).contains("ErrorResponse");
        assertThat(toString).contains(mensagem);
        assertThat(toString).contains(String.valueOf(codigoErro));
    }

    @Test
    void deveAceitarMensagemNula() {
        ErrorResponse errorResponse = new ErrorResponse(null, 500);

        assertThat(errorResponse.getMessage()).isNull();
        assertThat(errorResponse.getErrorCode()).isEqualTo(500);
    }

    @Test
    void deveAceitarMensagemVazia() {
        ErrorResponse errorResponse = new ErrorResponse("", 400);

        assertThat(errorResponse.getMessage()).isEmpty();
        assertThat(errorResponse.getErrorCode()).isEqualTo(400);
    }

    @Test
    void deveAceitarCodigosErroNegativos() {
        ErrorResponse errorResponse = new ErrorResponse("Erro customizado", -1);

        assertThat(errorResponse.getErrorCode()).isEqualTo(-1);
        assertThat(errorResponse.getMessage()).isEqualTo("Erro customizado");
    }

    @Test
    void deveAceitarCodigosErroZero() {
        ErrorResponse errorResponse = new ErrorResponse("Sucesso com erro", 0);

        assertThat(errorResponse.getErrorCode()).isEqualTo(0);
        assertThat(errorResponse.getMessage()).isEqualTo("Sucesso com erro");
    }

    @Test
    void deveTerComportamentoConsistenteComLombok() {
        ErrorResponse errorResponse = new ErrorResponse("Teste", 200);

        assertThat(errorResponse.getMessage()).isNotNull();
        assertThat(errorResponse.getErrorCode()).isNotNull();
        
        ErrorResponse outroErrorResponse = new ErrorResponse("Teste", 200);
        assertThat(errorResponse).isEqualTo(outroErrorResponse);
        
        assertThat(errorResponse.toString()).isNotNull();
        assertThat(errorResponse.toString()).isNotEmpty();
    }
}
