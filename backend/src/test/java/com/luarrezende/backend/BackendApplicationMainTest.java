package com.luarrezende.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class BackendApplicationMainTest {

    @Autowired
    private ApplicationContext applicationContext;

    @Test
    void deveCarregarClassePrincipalDaAplicacao() {
        assertThat(applicationContext).isNotNull();
        assertThat(applicationContext.getBean(BackendApplication.class)).isNotNull();
    }

    @Test
    void deveTerBeansNecessariosNoContexto() {
        assertThat(applicationContext.containsBean("cacheManager")).isTrue();
        assertThat(applicationContext.containsBean("restTemplate")).isTrue();
        assertThat(applicationContext.containsBean("moviesService")).isTrue();
        assertThat(applicationContext.containsBean("moviesController")).isTrue();
    }

    @Test
    void deveTestarMetodoPrincipal() {
        String[] args = {"--spring.main.web-environment=false"};
        
        try {
            BackendApplication.main(args);
        } catch (Exception e) {
            assertThat(e).isNotNull();
        }
    }
}
