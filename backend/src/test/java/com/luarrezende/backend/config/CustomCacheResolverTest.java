package com.luarrezende.backend.config;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheOperation;
import org.springframework.cache.interceptor.CacheableOperation;
import org.springframework.cache.interceptor.CacheOperationInvocationContext;

import java.util.Collection;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CustomCacheResolverTest {

    private CustomCacheResolver customCacheResolver;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private CacheOperationInvocationContext<CacheOperation> context;

    @Mock
    private CacheableOperation cacheableOperation;

    @Mock
    private Cache cache;

    @Mock
    private Cache.ValueWrapper valueWrapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        customCacheResolver = new CustomCacheResolver(cacheManager);
    }

    @Test
    void deveLogarCacheHitQuandoDadosEstaoNoCache() {
        String cacheName = "moviesByTitle";
        String key = "matrix";
        Object[] args = {key};
        
        when(context.getOperation()).thenReturn(cacheableOperation);
        when(cacheableOperation.getCacheNames()).thenReturn(Set.of(cacheName));
        when(context.getArgs()).thenReturn(args);
        when(cacheManager.getCache(cacheName)).thenReturn(cache);
        when(cache.get(key.toLowerCase().trim())).thenReturn(valueWrapper);

        Collection<? extends Cache> result = customCacheResolver.resolveCaches(context);

        assertThat(result).isNotEmpty();
        verify(cache).get(key.toLowerCase().trim());
    }

    @Test
    void deveUsarArraysToStringQuandoMaisDeDoisParametros() {
        String cacheName = "testCache";
        Object[] args = {"param1", "param2", "param3"}; // Mais de 2 parâmetros
        
        when(context.getOperation()).thenReturn(cacheableOperation);
        when(cacheableOperation.getCacheNames()).thenReturn(Set.of(cacheName));
        when(context.getArgs()).thenReturn(args);
        when(cacheManager.getCache(cacheName)).thenReturn(cache);
        when(cache.get("[param1, param2, param3]")).thenReturn(null);

        Collection<? extends Cache> result = customCacheResolver.resolveCaches(context);

        assertThat(result).isNotEmpty();
        verify(cache).get("[param1, param2, param3]");
    }

    @Test
    void deveGerarChaveCorretaComUmParametro() {
        String cacheName = "moviesByTitle";
        Object[] args = {"The Matrix"};
        
        when(context.getOperation()).thenReturn(cacheableOperation);
        when(cacheableOperation.getCacheNames()).thenReturn(Set.of(cacheName));
        when(context.getArgs()).thenReturn(args);
        when(cacheManager.getCache(cacheName)).thenReturn(cache);
        when(cache.get("the matrix")).thenReturn(null);

        customCacheResolver.resolveCaches(context);

        verify(cache).get("the matrix");
    }

    @Test
    void deveGerarChaveCorretaComDoisParametros() {
        String cacheName = "movieSearch";
        Object[] args = {"Matrix", 1};
        
        when(context.getOperation()).thenReturn(cacheableOperation);
        when(cacheableOperation.getCacheNames()).thenReturn(Set.of(cacheName));
        when(context.getArgs()).thenReturn(args);
        when(cacheManager.getCache(cacheName)).thenReturn(cache);
        when(cache.get("matrix_page_1")).thenReturn(null);

        customCacheResolver.resolveCaches(context);

        verify(cache).get("matrix_page_1");
    }

    @Test
    void deveLogarCacheMissQuandoDadosNaoEstaoNoCache() {
        String cacheName = "moviesByTitle";
        String key = "nonexistent";
        Object[] args = {key};
        
        when(context.getOperation()).thenReturn(cacheableOperation);
        when(cacheableOperation.getCacheNames()).thenReturn(Set.of(cacheName));
        when(context.getArgs()).thenReturn(args);
        when(cacheManager.getCache(cacheName)).thenReturn(cache);
        when(cache.get(key.toLowerCase().trim())).thenReturn(null);

        Collection<? extends Cache> result = customCacheResolver.resolveCaches(context);

        assertThat(result).isNotEmpty();
        verify(cache).get(key.toLowerCase().trim());
    }

    @Test
    void deveFiltrarCachesNulosERetornarApenasValidos() {
        String cacheName1 = "validCache";
        String cacheName2 = "invalidCache";
        Object[] args = {"test"};
        
        when(context.getOperation()).thenReturn(cacheableOperation);
        when(cacheableOperation.getCacheNames()).thenReturn(Set.of(cacheName1, cacheName2));
        when(context.getArgs()).thenReturn(args);
        when(cacheManager.getCache(cacheName1)).thenReturn(cache);
        when(cacheManager.getCache(cacheName2)).thenReturn(null); // Cache inválido
        when(cache.get("test")).thenReturn(null);

        Collection<? extends Cache> result = customCacheResolver.resolveCaches(context);

        assertThat(result).hasSize(1);
        assertThat(result.iterator().next()).isEqualTo(cache);
    }
}
