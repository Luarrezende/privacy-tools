package com.luarrezende.backend;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * Classe base para testes de integração
 * Configura o contexto Spring comum para todos os testes de integração
 */
@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:application-test.properties")
public abstract class BaseIntegrationTest {
    
    // Configurações comuns para testes de integração
    // Métodos utilitários podem ser adicionados aqui
}
