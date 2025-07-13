package com.luarrezende.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.interceptor.CacheEvictOperation;
import org.springframework.cache.interceptor.CacheOperation;
import org.springframework.cache.interceptor.CachePutOperation;
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
        CacheOperation operation = context.getOperation();
        Collection<String> cacheNames = operation.getCacheNames();
        
        logger.info("� CACHE RESOLVER: Resolvendo caches para operação: {} em caches: {}", 
                   operation.getClass().getSimpleName(), cacheNames);
        
        // Para operações Cacheable, verificar se já existe no cache
        if (operation instanceof CacheableOperation) {
            for (String cacheName : cacheNames) {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    Object key = generateKey(context);
                    Cache.ValueWrapper valueWrapper = cache.get(key);
                    if (valueWrapper != null) {
                        logger.info("✅ CACHE HIT encontrado! Cache: '{}', Chave: '{}' - DADOS VINDOS DO CACHE", cacheName, key);
                    } else {
                        logger.info("❌ CACHE MISS! Cache: '{}', Chave: '{}' - EXECUTARÁ API EXTERNA", cacheName, key);
                    }
                }
            }
        }
        
        return cacheNames.stream()
                .map(cacheManager::getCache)
                .toList();
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
