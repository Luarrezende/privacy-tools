package com.luarrezende.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheOperation;
import org.springframework.cache.interceptor.CacheableOperation;
import org.springframework.cache.interceptor.CacheOperationInvocationContext;
import org.springframework.cache.interceptor.CacheResolver;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Component
public class CustomCacheResolver implements CacheResolver {
    
    private static final Logger logger = LoggerFactory.getLogger(CustomCacheResolver.class);
    private final CacheManager cacheManager;
    
    public CustomCacheResolver(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }
    
    @Override
    public Collection<? extends Cache> resolveCaches(CacheOperationInvocationContext<?> context) {
        CacheOperation operation = (CacheOperation) context.getOperation();
        Collection<String> cacheNames = operation.getCacheNames();
        
        logger.info("[CACHE RESOLVER] Resolvendo caches para operacao: {} em caches: {}", 
                    operation.getClass().getSimpleName(), cacheNames);

        if (operation instanceof CacheableOperation) {
            for (String cacheName : cacheNames) {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    Object key = generateKey(context);
                    Cache.ValueWrapper valueWrapper = cache.get(key);
                    if (valueWrapper != null) {
                        logger.info("[CACHE HIT] Dados encontrados no cache '{}' com chave: '{}' - RETORNANDO DO CACHE", cacheName, key);
                    } else {
                        logger.info("[CACHE MISS] Cache '{}' vazio para chave: '{}' - EXECUTARA API EXTERNA", cacheName, key);
                    }
                }
            }
        }
        
        return cacheNames.stream()
                .map(cacheManager::getCache)
                .filter(java.util.Objects::nonNull)
                .collect(java.util.stream.Collectors.toList());
    }
    
    private Object generateKey(CacheOperationInvocationContext<?> context) {
        Object[] args = context.getArgs();
        if (args.length == 1) {
            return args[0].toString().toLowerCase().trim();
        } else if (args.length == 2) {
            return args[0].toString().toLowerCase().trim() + "_page_" + args[1].toString();
        }
        return java.util.Arrays.toString(args);
    }
}
