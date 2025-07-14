package com.luarrezende.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class BackendApplicationTests {

	@Test
	void deveCarregarContextoDaAplicacao() {
		// Este teste verifica se o contexto Spring carrega corretamente
		// Se o contexto não carregar, o teste falhará automaticamente
	}
}
