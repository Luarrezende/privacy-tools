# API de Séries - Temporadas e Episódios

Este documento descreve os novos endpoints implementados para buscar temporadas e episódios específicos de séries.

## Novos Endpoints

### 1. Buscar Temporada
**GET** `/api/series/season`

Obtém os detalhes de uma temporada específica de uma série, incluindo lista de episódios.

**Parâmetros:**
- `seriesId` (obrigatório): ID único da série (ex: "tt0903747")
- `season` (obrigatório): Número da temporada (ex: "1")

**Exemplo de uso:**
```bash
curl -X GET "http://localhost:8080/api/series/season?seriesId=tt0903747&season=1"
```

**Resposta de sucesso:**
```json
{
  "title": "Breaking Bad",
  "season": "1",
  "totalSeasons": "5",
  "episodes": [
    {
      "title": "Pilot",
      "released": "2008-01-20",
      "episode": "1",
      "imdbRating": "8.2",
      "imdbID": "tt0959621"
    },
    {
      "title": "Cat's in the Bag...",
      "released": "2008-01-27",
      "episode": "2",
      "imdbRating": "8.2",
      "imdbID": "tt1135086"
    }
  ],
  "success": true
}
```

### 2. Buscar Episódio
**GET** `/api/series/episode`

Obtém os detalhes de um episódio específico de uma série.

**Parâmetros:**
- `seriesId` (obrigatório): ID único da série (ex: "tt0903747")
- `season` (obrigatório): Número da temporada (ex: "1")
- `episode` (obrigatório): Número do episódio (ex: "3")

**Exemplo de uso:**
```bash
curl -X GET "http://localhost:8080/api/series/episode?seriesId=tt0903747&season=1&episode=3"
```

**Resposta de sucesso:**
```json
{
  "id": "tt1149287",
  "title": "And the Bag's in the River",
  "released": "2008-02-10",
  "episode": "3",
  "imdbRating": "8.1",
  "success": true
}
```

## Como usar os parâmetros Season e Episode

Conforme solicitado, os novos endpoints utilizam os parâmetros `Season` e `Episode` para buscar conteúdo específico:

### Exemplo prático com Breaking Bad:
1. **Temporada 1**: `?seriesId=tt0903747&season=1`
2. **Temporada 1, Episódio 3**: `?seriesId=tt0903747&season=1&episode=3`

### Exemplo com outra série (Game of Thrones):
1. **Temporada 2**: `?seriesId=tt0944947&season=2`
2. **Temporada 2, Episódio 5**: `?seriesId=tt0944947&season=2&episode=5`

## Tratamento de Erros

### Temporada não encontrada:
```json
{
  "success": false,
  "errorMessage": "Temporada não encontrada"
}
```

### Episódio não encontrado:
```json
{
  "success": false,
  "errorMessage": "Episódio não encontrado"
}
```

## Cache

Ambos os endpoints utilizam cache para melhorar a performance:
- **Temporadas**: Cache com chave `seriesId_season` (ex: "tt0903747_1")
- **Episódios**: Cache com chave `seriesId_season_episode` (ex: "tt0903747_1_3")
- **TTL**: 1 hora
- **Máximo de entradas**: 500

## Integração com OMDB API

Os endpoints fazem chamadas para a API do OMDB com os seguintes formatos:
- **Temporada**: `http://www.omdbapi.com/?i={seriesId}&Season={season}&apikey={apiKey}`
- **Episódio**: `http://www.omdbapi.com/?i={seriesId}&Season={season}&Episode={episode}&apikey={apiKey}`

## Swagger/OpenAPI

Os novos endpoints estão documentados no Swagger e podem ser testados através da interface web em:
`http://localhost:8080/swagger-ui.html`
