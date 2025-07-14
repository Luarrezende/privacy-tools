# 🎬 Guia Completo de Endpoints - Movies & Series API

Este guia contém exemplos práticos de todos os endpoints disponíveis na API.

## 🎥 **MOVIES API** - `/api/movies`

### 1. Buscar Filme por Título
**GET** `/api/movies/search`

Busca um filme específico e retorna detalhes completos.

```bash
# Exemplo 1: The Matrix
curl -X GET "http://localhost:8080/api/movies/search?title=The Matrix"

# Exemplo 2: Inception
curl -X GET "http://localhost:8080/api/movies/search?title=Inception"

# Exemplo 3: Filme com espaços
curl -X GET "http://localhost:8080/api/movies/search?title=Avengers%20Endgame"
```

### 2. Buscar Todos os Filmes por Título (com Paginação)
**GET** `/api/movies/searchall`

```bash
# Exemplo 1: Buscar todos os filmes com "Matrix" - Página 1
curl -X GET "http://localhost:8080/api/movies/searchall?title=Matrix&page=1"

# Exemplo 2: Buscar filmes com "Batman" - Página 2
curl -X GET "http://localhost:8080/api/movies/searchall?title=Batman&page=2"

# Exemplo 3: Sem especificar página (usa padrão = 1)
curl -X GET "http://localhost:8080/api/movies/searchall?title=Spider"
```

### 3. Obter Detalhes do Filme por ID
**GET** `/api/movies/details`

```bash
# Exemplo 1: The Matrix (plot curto - padrão)
curl -X GET "http://localhost:8080/api/movies/details?id=tt0133093"

# Exemplo 2: Inception com plot completo
curl -X GET "http://localhost:8080/api/movies/details?id=tt1375666&plot=full"

# Exemplo 3: Avengers Endgame
curl -X GET "http://localhost:8080/api/movies/details?id=tt4154796&plot=short"
```

---

## 📺 **SERIES API** - `/api/series`

### 1. Buscar Série por Título
**GET** `/api/series/search`

```bash
# Exemplo 1: Breaking Bad
curl -X GET "http://localhost:8080/api/series/search?title=Breaking Bad"

# Exemplo 2: Game of Thrones
curl -X GET "http://localhost:8080/api/series/search?title=Game of Thrones"

# Exemplo 3: The Office
curl -X GET "http://localhost:8080/api/series/search?title=The Office"
```

### 2. Buscar Todas as Séries por Título (com Paginação)
**GET** `/api/series/searchall`

```bash
# Exemplo 1: Buscar séries com "Breaking" - Página 1
curl -X GET "http://localhost:8080/api/series/searchall?title=Breaking&page=1"

# Exemplo 2: Buscar séries com "Friends"
curl -X GET "http://localhost:8080/api/series/searchall?title=Friends"

# Exemplo 3: Séries com "House" - Página 2
curl -X GET "http://localhost:8080/api/series/searchall?title=House&page=2"
```

### 3. Obter Detalhes da Série por ID
**GET** `/api/series/details`

```bash
# Exemplo 1: Breaking Bad (plot curto)
curl -X GET "http://localhost:8080/api/series/details?id=tt0903747"

# Exemplo 2: Game of Thrones com plot completo
curl -X GET "http://localhost:8080/api/series/details?id=tt0944947&plot=full"

# Exemplo 3: The Office
curl -X GET "http://localhost:8080/api/series/details?id=tt0386676&plot=short"
```

### 4. 🆕 Obter Detalhes da Temporada
**GET** `/api/series/season`

```bash
# Exemplo 1: Breaking Bad - Temporada 1
curl -X GET "http://localhost:8080/api/series/season?seriesId=tt0903747&season=1"

# Exemplo 2: Game of Thrones - Temporada 3
curl -X GET "http://localhost:8080/api/series/season?seriesId=tt0944947&season=3"

# Exemplo 3: The Office - Temporada 2
curl -X GET "http://localhost:8080/api/series/season?seriesId=tt0386676&season=2"

# Exemplo 4: Stranger Things - Temporada 4
curl -X GET "http://localhost:8080/api/series/season?seriesId=tt4574334&season=4"
```

### 5. 🆕 Obter Detalhes do Episódio
**GET** `/api/series/episode`

```bash
# Exemplo 1: Breaking Bad - T1E3 "And the Bag's in the River"
curl -X GET "http://localhost:8080/api/series/episode?seriesId=tt0903747&season=1&episode=3"

# Exemplo 2: Game of Thrones - T1E1 "Winter Is Coming"
curl -X GET "http://localhost:8080/api/series/episode?seriesId=tt0944947&season=1&episode=1"

# Exemplo 3: The Office - T2E1 "The Dundies"
curl -X GET "http://localhost:8080/api/series/episode?seriesId=tt0386676&season=2&episode=1"

# Exemplo 4: Friends - T1E1 "The Pilot"
curl -X GET "http://localhost:8080/api/series/episode?seriesId=tt0108778&season=1&episode=1"
```

---

## 🧪 **Testes com Postman/Insomnia**

### Collection JSON para Postman:
```json
{
  "info": {
    "name": "Movies & Series API",
    "description": "Coleção completa de endpoints"
  },
  "item": [
    {
      "name": "Movies",
      "item": [
        {
          "name": "Search Movie",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/movies/search?title=The Matrix"
          }
        },
        {
          "name": "Search All Movies",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/movies/searchall?title=Matrix&page=1"
          }
        },
        {
          "name": "Movie Details",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/movies/details?id=tt0133093&plot=full"
          }
        }
      ]
    },
    {
      "name": "Series",
      "item": [
        {
          "name": "Search Series",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/series/search?title=Breaking Bad"
          }
        },
        {
          "name": "Season Details",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/series/season?seriesId=tt0903747&season=1"
          }
        },
        {
          "name": "Episode Details",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/series/episode?seriesId=tt0903747&season=1&episode=3"
          }
        }
      ]
    }
  ]
}
```

---

## 🎯 **IDs de Referência para Testes**

### 🎬 Filmes Populares:
- **The Matrix**: `tt0133093`
- **Inception**: `tt1375666`
- **The Dark Knight**: `tt0468569`
- **Avengers: Endgame**: `tt4154796`
- **Pulp Fiction**: `tt0110912`
- **The Godfather**: `tt0068646`
- **Interstellar**: `tt0816692`

### 📺 Séries Populares:
- **Breaking Bad**: `tt0903747`
- **Game of Thrones**: `tt0944947`
- **The Office (US)**: `tt0386676`
- **Friends**: `tt0108778`
- **Stranger Things**: `tt4574334`
- **The Sopranos**: `tt0141842`
- **Lost**: `tt0411008`

---

## 🔧 **Variáveis de Ambiente**

Para facilitar os testes, configure estas variáveis:

```bash
# Para desenvolvimento local
export BASE_URL="http://localhost:8080"

# Para produção (se aplicável)
export BASE_URL="https://your-api-domain.com"
```

---

## 📊 **Exemplos de Respostas**

### Resposta de Sucesso - Movie Details:
```json
{
  "id": "tt0133093",
  "title": "The Matrix",
  "year": "1999",
  "genre": ["Action", "Sci-Fi"],
  "director": "Lana Wachowski, Lilly Wachowski",
  "plot": "A computer programmer is led to fight an underground war...",
  "imdbRating": "8.7",
  "success": true
}
```

### Resposta de Sucesso - Episode Details:
```json
{
  "id": "tt1149287",
  "title": "And the Bag's in the River",
  "episode": "3",
  "season": "1",
  "released": "2008-02-10",
  "imdbRating": "8.1",
  "success": true
}
```

### Resposta de Erro:
```json
{
  "success": false,
  "errorMessage": "Filme não encontrado"
}
```

---

## 🚀 **Teste Rápido - Script Bash**

```bash
#!/bin/bash
BASE_URL="http://localhost:8080"

echo "🎬 Testando Movies API..."
curl -s "$BASE_URL/api/movies/search?title=The Matrix" | jq '.title'

echo "📺 Testando Series API..."
curl -s "$BASE_URL/api/series/search?title=Breaking Bad" | jq '.title'

echo "🆕 Testando Season API..."
curl -s "$BASE_URL/api/series/season?seriesId=tt0903747&season=1" | jq '.title'

echo "🆕 Testando Episode API..."
curl -s "$BASE_URL/api/series/episode?seriesId=tt0903747&season=1&episode=3" | jq '.title'
```

---

## 📖 **Swagger UI**

Acesse a documentação interativa em: `http://localhost:8080/swagger-ui.html`

Lá você pode testar todos os endpoints diretamente pela interface web!
