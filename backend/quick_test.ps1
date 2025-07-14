# 🎬🍿 SCRIPT DE TESTE RÁPIDO - Movies & Series API (PowerShell)
# Execute: .\quick_test.ps1

$BASE_URL = "http://localhost:8080"

Write-Host "🚀 Iniciando testes da API..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Função para testar endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedField
    )
    
    Write-Host "🔍 Testando: $Name" -ForegroundColor Yellow
    Write-Host "📡 URL: $Url" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -ContentType "application/json"
        
        if ($response.$ExpectedField) {
            Write-Host "✅ SUCESSO: $($response.$ExpectedField)" -ForegroundColor Green
        } else {
            Write-Host "❌ ERRO: $($response.errorMessage)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host "---" -ForegroundColor Gray
}

Write-Host "🎬 TESTANDO MOVIES API" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

# Movies - Search
Test-Endpoint -Name "Buscar The Matrix" -Url "$BASE_URL/api/movies/search?title=The%20Matrix" -ExpectedField "title"

# Movies - Search All
Test-Endpoint -Name "Buscar todos Matrix (paginado)" -Url "$BASE_URL/api/movies/searchall?title=Matrix&page=1" -ExpectedField "totalResults"

# Movies - Details
Test-Endpoint -Name "Detalhes The Matrix por ID" -Url "$BASE_URL/api/movies/details?id=tt0133093" -ExpectedField "title"

Write-Host ""
Write-Host "📺 TESTANDO SERIES API" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

# Series - Search
Test-Endpoint -Name "Buscar Breaking Bad" -Url "$BASE_URL/api/series/search?title=Breaking%20Bad" -ExpectedField "title"

# Series - Search All
Test-Endpoint -Name "Buscar todas Breaking (paginado)" -Url "$BASE_URL/api/series/searchall?title=Breaking&page=1" -ExpectedField "totalResults"

# Series - Details
Test-Endpoint -Name "Detalhes Breaking Bad por ID" -Url "$BASE_URL/api/series/details?id=tt0903747" -ExpectedField "title"

Write-Host ""
Write-Host "🆕 TESTANDO NOVOS ENDPOINTS - TEMPORADAS E EPISÓDIOS" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

# Season Details
Test-Endpoint -Name "Breaking Bad - Temporada 1" -Url "$BASE_URL/api/series/season?seriesId=tt0903747&season=1" -ExpectedField "title"

# Episode Details
Test-Endpoint -Name "Breaking Bad - T1E3" -Url "$BASE_URL/api/series/episode?seriesId=tt0903747&season=1&episode=3" -ExpectedField "title"

# Game of Thrones Season
Test-Endpoint -Name "Game of Thrones - Temporada 1" -Url "$BASE_URL/api/series/season?seriesId=tt0944947&season=1" -ExpectedField "title"

# Game of Thrones Episode
Test-Endpoint -Name "Game of Thrones - T1E1" -Url "$BASE_URL/api/series/episode?seriesId=tt0944947&season=1&episode=1" -ExpectedField "title"

Write-Host ""
Write-Host "🎯 TESTANDO CASOS DE ERRO" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Cyan

# Teste de erro - ID inválido
Test-Endpoint -Name "Filme com ID inválido" -Url "$BASE_URL/api/movies/details?id=invalid123" -ExpectedField "errorMessage"

# Teste de erro - Temporada inexistente
Test-Endpoint -Name "Temporada inexistente" -Url "$BASE_URL/api/series/season?seriesId=tt0903747&season=99" -ExpectedField "errorMessage"

# Teste de erro - Episódio inexistente
Test-Endpoint -Name "Episódio inexistente" -Url "$BASE_URL/api/series/episode?seriesId=tt0903747&season=1&episode=99" -ExpectedField "errorMessage"

Write-Host ""
Write-Host "🎉 TESTES CONCLUÍDOS!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "📖 Para mais exemplos, veja: API_TESTING_GUIDE.md" -ForegroundColor White
Write-Host "🌐 Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor White
