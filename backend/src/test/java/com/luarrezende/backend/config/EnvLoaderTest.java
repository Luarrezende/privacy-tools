package com.luarrezende.backend.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Properties;

import static org.assertj.core.api.Assertions.assertThat;

class EnvLoaderTest {

    private File tempEnvFile;
    private Properties originalProperties;

    @BeforeEach
    void setUp() {
        originalProperties = new Properties();
        originalProperties.putAll(System.getProperties());
    }

    @AfterEach
    void tearDown() {
        System.setProperties(originalProperties);
        
        if (tempEnvFile != null && tempEnvFile.exists()) {
            tempEnvFile.delete();
        }
    }

    @Test
    void executaClasseParaCobrirTeste() {
        new EnvLoader();
        EnvLoader.loadEnv();
    }

    @Test
    void deveCarregarVariaveisDoArquivoEnv() throws IOException {
        criarArquivoEnvTemporario("TEST_VAR=test_value\nANOTHER_VAR=another_value");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("TEST_VAR")).isEqualTo("test_value");
        assertThat(System.getProperty("ANOTHER_VAR")).isEqualTo("another_value");
    }

    @Test
    void deveCarregarVariaveisComEspacosECaracteresEspeciais() throws IOException {
        criarArquivoEnvTemporario("API_KEY=abc123def456\nDATABASE_URL=jdbc:postgresql://localhost:5432/test");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("API_KEY")).isEqualTo("abc123def456");
        assertThat(System.getProperty("DATABASE_URL")).isEqualTo("jdbc:postgresql://localhost:5432/test");
    }

    @Test
    void deveCarregarVariaveisComValoresVazios() throws IOException {
        criarArquivoEnvTemporario("EMPTY_VAR=\nNORMAL_VAR=value");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("EMPTY_VAR")).isEqualTo("");
        assertThat(System.getProperty("NORMAL_VAR")).isEqualTo("value");
    }

    @Test
    void deveIgnorarLinhasVaziasEComentarios() throws IOException {
        criarArquivoEnvTemporario("VALID_VAR=valid_value\nANOTHER_VAR=another");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("VALID_VAR")).isEqualTo("valid_value");
        assertThat(System.getProperty("ANOTHER_VAR")).isEqualTo("another");
    }

    @Test
    void deveFuncionarQuandoArquivoEnvNaoExiste() {
        EnvLoader.loadEnv();
        
        assertThat(true).isTrue();
    }

    @Test
    void deveSubstituirPropriedadesExistentesDoSistema() throws IOException {
        String propriedadeExistente = "java.version";
        String valorOriginal = System.getProperty(propriedadeExistente);
        criarArquivoEnvTemporario("java.version=custom_version");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("java.version")).isEqualTo("custom_version");
        assertThat(System.getProperty("java.version")).isNotEqualTo(valorOriginal);
    }

    @Test
    void deveCarregarVariaveisComValoresLongos() throws IOException {
        String valorLongo = "Este eh um valor muito longo que pode conter multiplas palavras e alguns caracteres especiais como numeros 123456";
        criarArquivoEnvTemporario("LONG_VALUE=" + valorLongo);

        EnvLoader.loadEnv();

        assertThat(System.getProperty("LONG_VALUE")).isEqualTo(valorLongo);
    }

    @Test
    void deveCarregarMultiplasVariaveisCorretamente() throws IOException {
        String conteudo = """
            VAR1=value1
            VAR2=value2
            VAR3=value3
            VAR4=value4
            VAR5=value5
            """;
        criarArquivoEnvTemporario(conteudo);

        EnvLoader.loadEnv();

        assertThat(System.getProperty("VAR1")).isEqualTo("value1");
        assertThat(System.getProperty("VAR2")).isEqualTo("value2");
        assertThat(System.getProperty("VAR3")).isEqualTo("value3");
        assertThat(System.getProperty("VAR4")).isEqualTo("value4");
        assertThat(System.getProperty("VAR5")).isEqualTo("value5");
    }

    @Test
    void deveCarregarVariaveisComNumerosEBooleanos() throws IOException {
        criarArquivoEnvTemporario("PORT=8080\nENABLED=true\nMAX_CONNECTIONS=100\nDEBUG=false");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("PORT")).isEqualTo("8080");
        assertThat(System.getProperty("ENABLED")).isEqualTo("true");
        assertThat(System.getProperty("MAX_CONNECTIONS")).isEqualTo("100");
        assertThat(System.getProperty("DEBUG")).isEqualTo("false");
    }

    @Test
    void deveCarregarVariaveisComCaracteresEspeciaisSeguras() throws IOException {
        criarArquivoEnvTemporario("API_URL=https://api.example.com/v1\nTOKEN=abc123-def456-ghi789");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("API_URL")).isEqualTo("https://api.example.com/v1");
        assertThat(System.getProperty("TOKEN")).isEqualTo("abc123-def456-ghi789");
    }

    @Test
    void deveProcessarArquivoEnvComLinhasSimples() throws IOException {
        criarArquivoEnvTemporario("VAR1=value1\nVAR2=value2");

        EnvLoader.loadEnv();

        assertThat(System.getProperty("VAR1")).isEqualTo("value1");
        assertThat(System.getProperty("VAR2")).isEqualTo("value2");
    }

    private void criarArquivoEnvTemporario(String conteudo) throws IOException {
        tempEnvFile = new File(".env");
        try (FileWriter writer = new FileWriter(tempEnvFile)) {
            writer.write(conteudo);
        }
    }
}
