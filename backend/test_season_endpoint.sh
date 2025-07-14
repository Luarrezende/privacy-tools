#!/bin/bash

echo "Testando endpoint de temporada..."
echo "URL: http://localhost:8080/api/series/season?seriesId=tt0903747&season=1"
echo ""

# Fazer a requisição e formatar o JSON
curl -s "http://localhost:8080/api/series/season?seriesId=tt0903747&season=1" | jq '.'
