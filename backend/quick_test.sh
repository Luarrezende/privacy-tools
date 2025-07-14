#!/bin/bash

# 🎬🍿 SCRIPT DE TESTE RÁPIDO - Movies & Series API
# Execute: chmod +x quick_test.sh && ./quick_test.sh

BASE_URL="http://localhost:8080"

echo "🚀 Iniciando testes da API..."
echo "=========================================="

# Função para testar endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_field="$3"
    
    echo "🔍 Testando: $name"
    echo "📡 URL: $url"
    
    response=$(curl -s "$url")
    
    if echo "$response" | jq -e ".$expected_field" > /dev/null 2>&1; then
        echo "✅ SUCESSO: $(echo "$response" | jq -r ".$expected_field")"
    else
        echo "❌ ERRO: $(echo "$response" | jq -r '.errorMessage // "Resposta inválida"')"
    fi
    echo "---"
}

echo "🎬 TESTANDO MOVIES API"
echo "=========================================="

# Movies - Search
test_endpoint "Buscar The Matrix" \
    "$BASE_URL/api/movies/search?title=The%20Matrix" \
    "title"

# Movies - Search All
test_endpoint "Buscar todos Matrix (paginado)" \
    "$BASE_URL/api/movies/searchall?title=Matrix&page=1" \
    "totalResults"

# Movies - Details
test_endpoint "Detalhes The Matrix por ID" \
    "$BASE_URL/api/movies/details?id=tt0133093" \
    "title"

echo ""
echo "📺 TESTANDO SERIES API"
echo "=========================================="

# Series - Search
test_endpoint "Buscar Breaking Bad" \
    "$BASE_URL/api/series/search?title=Breaking%20Bad" \
    "title"

# Series - Search All
test_endpoint "Buscar todas Breaking (paginado)" \
    "$BASE_URL/api/series/searchall?title=Breaking&page=1" \
    "totalResults"

# Series - Details
test_endpoint "Detalhes Breaking Bad por ID" \
    "$BASE_URL/api/series/details?id=tt0903747" \
    "title"

echo ""
echo "🆕 TESTANDO NOVOS ENDPOINTS - TEMPORADAS E EPISÓDIOS"
echo "=========================================="

# Season Details
test_endpoint "Breaking Bad - Temporada 1" \
    "$BASE_URL/api/series/season?seriesId=tt0903747&season=1" \
    "title"

# Episode Details
test_endpoint "Breaking Bad - T1E3" \
    "$BASE_URL/api/series/episode?seriesId=tt0903747&season=1&episode=3" \
    "title"

# Game of Thrones Season
test_endpoint "Game of Thrones - Temporada 1" \
    "$BASE_URL/api/series/season?seriesId=tt0944947&season=1" \
    "title"

# Game of Thrones Episode
test_endpoint "Game of Thrones - T1E1" \
    "$BASE_URL/api/series/episode?seriesId=tt0944947&season=1&episode=1" \
    "title"

echo ""
echo "🎯 TESTANDO CASOS DE ERRO"
echo "=========================================="

# Teste de erro - ID inválido
test_endpoint "Filme com ID inválido" \
    "$BASE_URL/api/movies/details?id=invalid123" \
    "errorMessage"

# Teste de erro - Temporada inexistente
test_endpoint "Temporada inexistente" \
    "$BASE_URL/api/series/season?seriesId=tt0903747&season=99" \
    "errorMessage"

# Teste de erro - Episódio inexistente
test_endpoint "Episódio inexistente" \
    "$BASE_URL/api/series/episode?seriesId=tt0903747&season=1&episode=99" \
    "errorMessage"

echo ""
echo "🎉 TESTES CONCLUÍDOS!"
echo "=========================================="
echo "📖 Para mais exemplos, veja: API_TESTING_GUIDE.md"
echo "🌐 Swagger UI: http://localhost:8080/swagger-ui.html"
