package com.luarrezende.backend.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.Cache;
import org.springframework.cache.interceptor.CacheResolver;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@TestPropertySource(properties = {
    "app.cache.enabled=true",
    "app.cache.ttl=300"
})
class CacheConfigAdvancedTest {

    @Autowired
    private CacheManager cacheManager;
    
    @Autowired
    private CacheResolver cacheResolver;

    @Test
    void deveConfigurarCacheComPropriedadesCorretas() {
        Cache moviesByTitleCache = cacheManager.getCache("moviesByTitle");

        assertThat(moviesByTitleCache).isNotNull();
        assertThat(moviesByTitleCache.getName()).isEqualTo("moviesByTitle");
    }

    @Test
    void deveTerCacheResolverPersonalizadoConfigurado() {
        assertThat(cacheResolver).isNotNull();
        assertThat(cacheResolver).isInstanceOf(CustomCacheResolver.class);
    }

    @Test
    void deveOperacoesDeCacheFuncionarCorretamente() {
        Cache testCache = cacheManager.getCache("moviesByTitle");
        String key = "test-key";
        String value = "test-value";

        testCache.put(key, value);
        Cache.ValueWrapper cachedValue = testCache.get(key);

        assertThat(cachedValue).isNotNull();
        assertThat(cachedValue.get()).isEqualTo(value);
    }

    @Test
    void deveRemocaoDeCacheFuncionarCorretamente() {
        Cache testCache = cacheManager.getCache("moviesByTitle");
        String key = "eviction-test-key";
        String value = "eviction-test-value";

        testCache.put(key, value);
        assertThat(testCache.get(key)).isNotNull();
        
        testCache.evict(key);

        assertThat(testCache.get(key)).isNull();
    }

    @Test
    void deveLimpezaDeCacheFuncionarCorretamente() {
        Cache testCache = cacheManager.getCache("moviesByTitle");
        testCache.put("key1", "value1");
        testCache.put("key2", "value2");

        testCache.clear();

        assertThat(testCache.get("key1")).isNull();
        assertThat(testCache.get("key2")).isNull();
    }

    @Test
    void deveTerTodosOsCachesEsperadosConfigurados() {
        java.util.Collection<String> cacheNames = cacheManager.getCacheNames();

        assertThat(cacheNames).contains("moviesByTitle", "moviesById", "movieSearch");
        assertThat(cacheNames).hasSize(3);
    }

    @Test
    void deveTratarCacheMissGraciosamente() {
        Cache testCache = cacheManager.getCache("moviesByTitle");
        String nonExistentKey = "non-existent-key";

        Cache.ValueWrapper result = testCache.get(nonExistentKey);

        assertThat(result).isNull();
    }
}
