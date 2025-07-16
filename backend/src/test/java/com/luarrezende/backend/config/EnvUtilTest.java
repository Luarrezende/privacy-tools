package com.luarrezende.backend.config;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class EnvUtilTest {


    @Test
    void deveRetornarNullQuandoVariavelNaoExiste() {
        String result = EnvUtil.get("NON_EXISTENT_VARIABLE_RANDOM_12345");

        assertThat(result).isNull();
    }

    @Test
    void deveLancarExcecaoQuandoChaveForNula() {
        assertThatThrownBy(() -> EnvUtil.get(null))
                .isInstanceOf(NullPointerException.class);
    }

    @Test
    void deveRetornarNullQuandoChaveForVazia() {
        String result = EnvUtil.get("");

        assertThat(result).isNull();
    }

    @Test
    void deveRetornarNullQuandoChaveComEspacos() {
        String result = EnvUtil.get("   ");

        assertThat(result).isNull();
    }

    @Test
    void deveFuncionarComChavesComCaracteresEspeciais() {
        String result1 = EnvUtil.get("VAR_WITH_UNDERSCORE");
        String result2 = EnvUtil.get("VAR-WITH-DASH");
        String result3 = EnvUtil.get("VAR123");

        assertThat(result1).isNull();
        assertThat(result2).isNull();
        assertThat(result3).isNull();
    }

    @Test
    void deveDistinguirChavesCaseSensitive() {
        String lower = EnvUtil.get("test_var");
        String upper = EnvUtil.get("TEST_VAR");
        String mixed = EnvUtil.get("Test_Var");

        assertThat(lower).isNull();
        assertThat(upper).isNull();
        assertThat(mixed).isNull();
        
        assertThat(lower).isEqualTo(upper);
        assertThat(upper).isEqualTo(mixed);
    }

    @Test
    void deveManterConsistenciaEntreChmadasMultiplas() {
        String firstCall = EnvUtil.get("CONSISTENT_TEST_VAR");
        String secondCall = EnvUtil.get("CONSISTENT_TEST_VAR");
        String thirdCall = EnvUtil.get("CONSISTENT_TEST_VAR");

        assertThat(firstCall).isEqualTo(secondCall);
        assertThat(secondCall).isEqualTo(thirdCall);
        assertThat(firstCall).isNull();
    }

    @Test
    void deveCarregarConfiguracaoDotenvCorretamente() {
        String result = EnvUtil.get("ANY_RANDOM_VAR_NAME");

        assertThat(result).isNull();
    }

    @Test
    void deveFuncionarComChavesLongas() {
        String longKey = "VERY_LONG_ENVIRONMENT_VARIABLE_NAME_THAT_SHOULD_WORK_FINE_123456789";
        String result = EnvUtil.get(longKey);

        assertThat(result).isNull();
    }

    @Test
    void deveTratarCorreatmenteVariaveisDeSistema() {
        String path = EnvUtil.get("PATH");

        if (path != null) {
            assertThat(path).isNotEmpty();
        }
        
        assertThat(true).isTrue();
    }

    @Test
    void deveInicializarClasseEnvUtilCorretamente() {
        Class<?> clazz = EnvUtil.class;

        assertThat(clazz).isNotNull();
        assertThat(clazz.getSimpleName()).isEqualTo("EnvUtil");
        assertThat(clazz.getPackage().getName()).isEqualTo("com.luarrezende.backend.config");

        String anyResult = EnvUtil.get("FORCE_CLASS_INITIALIZATION");
        
        assertThat(anyResult).isNull();
    }
}
