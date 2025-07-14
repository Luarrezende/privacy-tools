package com.luarrezende.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.CacheManager;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(properties = {
    "app.cache.enabled=true",
    "app.cache.ttl=300"
})
class ConfigurationTest {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private CacheManager cacheManager;

    @Test
    void deveCriarBeanRestTemplate() {
        assertThat(restTemplate).isNotNull();
    }

    @Test
    void deveCriarBeanCacheManager() {
        assertThat(cacheManager).isNotNull();
    }

    @Test
    void deveTerCacheDeFilmesConfigurado() {
        assertThat(cacheManager.getCache("moviesByTitle")).isNotNull();
    }

    @Test
    void deveTerCacheDeBuscaConfigurado() {
        assertThat(cacheManager.getCache("movieSearch")).isNotNull();
    }

    @Test
    void deveTerCacheDeFilmesPorIdConfigurado() {
        assertThat(cacheManager.getCache("moviesById")).isNotNull();
    }
}
