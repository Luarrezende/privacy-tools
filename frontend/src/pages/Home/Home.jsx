import React, { useState, useEffect } from 'react';
import MovieCard from '../../components/ui/MovieCard';
import { apiBaseUrlL, apiEndpoints } from '../../constants/api';
import styles from './Home.module.css';

const Home = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para buscar filmes e séries
  const searchContent = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Buscar filmes e séries em paralelo
      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch(`${apiBaseUrlL}${apiEndpoints.movies.searchAll}?title=${encodeURIComponent(query)}`),
        fetch(`${apiBaseUrlL}${apiEndpoints.SERIES.searchAll}?title=${encodeURIComponent(query)}`)
      ]);

      const moviesData = moviesResponse.ok ? await moviesResponse.json() : [];
      const seriesData = seriesResponse.ok ? await seriesResponse.json() : [];

      // Combinar resultados
      const allResults = [
        ...moviesData.map(item => ({ ...item, type: 'movie' })),
        ...seriesData.map(item => ({ ...item, type: 'series' }))
      ];

      setResults(allResults);
    } catch (err) {
      setError('Erro ao buscar conteúdo');
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  };

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

  // Escutar mudanças no campo de busca global
  useEffect(() => {
    // Você pode implementar uma função para escutar o campo de busca do layout
    // Por agora, vou criar uma busca de exemplo
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value) {
          searchContent(searchInput.value);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
            Resultados da Busca ({results.length})
          </h2>
          
          <div className={styles.grid}>
            {results.map((item, index) => (
              <MovieCard
                key={`${item.type}-${item.id || index}`}
                movie={{
                  title: item.title || item.name,
                  rating: item.rating || 85,
                  ageRating: item.ageRating || '16',
                  year: item.year || '2023',
                  duration: item.duration || '2h 18min',
                  genres: item.genres || ['Ação', 'Drama'],
                  description: item.description || item.overview || 'Descrição não disponível',
                  poster: item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80'
                }}
                onWatch={handleWatch}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
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
