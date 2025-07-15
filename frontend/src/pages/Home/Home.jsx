import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import MovieCard from '../../components/ui/MovieCard';
import Pagination from '../../components/ui/Pagination';
import { apiBaseUrlL, apiEndpoints } from '../../constants/api';
import styles from './Home.module.css';

const Home = () => {
  const { searchQuery, filters, pagination, handlePageChange, updatePagination } = useSearch();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar filmes e séries
  const searchContent = async (query, page = 1) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar filmes e séries em paralelo
      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch(`${apiBaseUrlL}${apiEndpoints.movies.searchAll}?title=${encodeURIComponent(query)}&page=${page}`),
        fetch(`${apiBaseUrlL}${apiEndpoints.SERIES.searchAll}?title=${encodeURIComponent(query)}&page=${page}`)
      ]);

      // Verificar se as respostas são válidas e parsear JSON
      let moviesData = [];
      let seriesData = [];
      let moviesJson = {};
      let seriesJson = {};

      if (moviesResponse.ok) {
        moviesJson = await moviesResponse.json();
        console.log('Movies API Response:', moviesJson);
        // Acessar a propriedade movies do objeto retornado
        moviesData = Array.isArray(moviesJson.movies) ? moviesJson.movies : [];
      }

      if (seriesResponse.ok) {
        seriesJson = await seriesResponse.json();
        console.log('Series API Response:', seriesJson);
        // Acessar a propriedade series do objeto retornado
        seriesData = Array.isArray(seriesJson.series) ? seriesJson.series : [];
      }

      // Combinar resultados
      const allResults = [
        ...moviesData.map(item => ({ ...item, type: 'movie' })),
        ...seriesData.map(item => ({ ...item, type: 'series' }))
      ];

      console.log('Movies found:', moviesData.length);
      console.log('Series found:', seriesData.length);
      console.log('Sample movie data:', moviesData[0]);
      console.log('Sample series data:', seriesData[0]);
      console.log('Combined results:', allResults);
      
      setResults(allResults);
      updatePagination(moviesJson, seriesJson);
    } catch (err) {
      setError('Erro ao buscar conteúdo');
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  };

  // Executar busca quando searchQuery ou página mudar
  useEffect(() => {
    searchContent(searchQuery, pagination.currentPage);
  }, [searchQuery, pagination.currentPage]);

  // Função para assistir (placeholder)
  const handleWatch = (item) => {
    console.log('Assistir:', item);
    // Aqui você pode navegar para a página de detalhes ou player
  };

  // Função para adicionar à lista (placeholder)
  const handleAddToList = (item) => {
    console.log('Adicionar à lista:', item);
    // Aqui você pode implementar a lógica de favoritos
  };

  return (
    <div className={styles.container}>
      {/* Título */}
      <div className={styles.header}>
        <h1 className={styles.title}>Privacy Tools</h1>
        <p className={styles.subtitle}>
          Busque por filmes e séries usando a barra de pesquisa acima
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Buscando...</span>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>
            Resultados da Busca ({pagination.totalResults})
          </h2>
          
          <div className={styles.grid}>
            {results.map((item, index) => (
              <MovieCard
                key={`${item.type}-${item.id || index}`}
                movie={{
                  id: item.id,
                  title: item.title,
                  rating: item.imdbRating ? Math.round(item.imdbRating * 10) : 85,
                  ageRating: item.rated || '16',
                  year: item.year,
                  duration: item.runtime || '2h 18min',
                  genres: item.genre ? item.genre.split(', ') : ['Drama'],
                  description: item.plot || item.description || 'Descrição não disponível',
                  poster: item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
                  type: item.type
                }}
                onWatch={handleWatch}
                onAddToList={handleAddToList}
              />
            ))}
          </div>

          {/* Paginação */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalResults={pagination.totalResults}
            hasNextPage={pagination.hasNextPage}
            hasPreviousPage={pagination.hasPreviousPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Estado inicial - sem busca */}
      {!loading && !error && results.length === 0 && (
        <div className={styles.empty}>
          <i className="fas fa-search"></i>
          <h3>Comece sua busca</h3>
          <p>Use a barra de pesquisa acima para encontrar filmes e séries</p>
        </div>
      )}
    </div>
  );
};

export default Home;
