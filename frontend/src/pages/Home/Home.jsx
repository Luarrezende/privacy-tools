import React, { useState, useEffect } from 'react';
import { useSearch } from '../../context/SearchContext';
import MovieCard from '../../components/ui/MovieCard/MovieCard';
import Pagination from '../../components/ui/Pagination/Pagination';
import ActiveFilters from '../../components/ui/ActiveFilters/ActiveFilters';
import { apiBaseUrlL, apiEndpoints } from '../../constants/api';
import { applyFilters } from '../../constants/filters';
import styles from './Home.module.css';

const Home = () => {
  const { 
    searchQuery, 
    filters, 
    pagination, 
    handlePageChange, 
    updatePagination, 
    handleFilterChange, 
    clearSearch 
  } = useSearch();
  const [allResults, setAllResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchContent = async (query, page = 1) => {
    if (!query.trim()) {
      setAllResults([]);
      setFilteredResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [moviesResponse, seriesResponse] = await Promise.all([
        fetch(`${apiBaseUrlL}${apiEndpoints.movies.searchAll}?title=${encodeURIComponent(query)}&page=${page}`),
        fetch(`${apiBaseUrlL}${apiEndpoints.SERIES.searchAll}?title=${encodeURIComponent(query)}&page=${page}`)
      ]);

      let moviesData = [];
      let seriesData = [];
      let moviesJson = {};
      let seriesJson = {};

      if (moviesResponse.ok) {
        moviesJson = await moviesResponse.json();
        console.log('Movies API Response:', moviesJson);
        if (Array.isArray(moviesJson)) {
          moviesData = moviesJson;
        } else if (Array.isArray(moviesJson.movies)) {
          moviesData = moviesJson.movies;
        } else if (Array.isArray(moviesJson.Search)) {
          moviesData = moviesJson.Search;
        } else if (Array.isArray(moviesJson.results)) {
          moviesData = moviesJson.results;
        } else {
          moviesData = [];
        }
      }

      if (seriesResponse.ok) {
        seriesJson = await seriesResponse.json();
        console.log('Series API Response:', seriesJson);
        if (Array.isArray(seriesJson)) {
          seriesData = seriesJson;
        } else if (Array.isArray(seriesJson.series)) {
          seriesData = seriesJson.series;
        } else if (Array.isArray(seriesJson.Search)) {
          seriesData = seriesJson.Search;
        } else if (Array.isArray(seriesJson.results)) {
          seriesData = seriesJson.results;
        } else {
          seriesData = [];
        }
      }

      const allResults = [
        ...moviesData,
        ...seriesData
      ];

      console.log('Movies found:', moviesData.length);
      console.log('Series found:', seriesData.length);
      console.log('Sample movie data:', moviesData[0]);
      console.log('Sample series data:', seriesData[0]);
      console.log('Combined results length:', allResults.length);
      console.log('Combined results sample:', allResults[0]);
      
      setAllResults(allResults);
      
      const filtered = applyFilters(allResults, filters);
      console.log('Filtered results length:', filtered.length);
      console.log('Filtered results sample:', filtered[0]);
      setFilteredResults(filtered);
      updatePagination(moviesJson, seriesJson);
    } catch (err) {
      setError('Erro ao buscar conteúdo');
      console.error('Erro na busca:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchContent(searchQuery, pagination.currentPage);
  }, [searchQuery, pagination.currentPage]);

  useEffect(() => {
    if (allResults.length > 0) {
      const filtered = applyFilters(allResults, filters);
      setFilteredResults(filtered);
    }
  }, [filters, allResults]);

  const handleRemoveFilter = (filterKey) => {
    if (filterKey === 'sortBy') {
      handleFilterChange('sortBy', 'relevance');
    } else {
      handleFilterChange(filterKey, '');
    }
  };

  return (
    <div className={styles.container}>
      <ActiveFilters 
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={clearSearch}
      />

      {loading && (
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Buscando...</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      {filteredResults.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>
            Resultados da Busca ({filteredResults.length})
          </h2>
          
          <div className={styles.grid}>
            {filteredResults.map((item, index) => (
              <MovieCard
                key={`${item.type}-${item.id || index}`}
                movie={{
                  id: item.id,
                  title: item.title,
                  year: item.year,
                  poster: item.poster !== 'N/A' ? item.poster : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80',
                  type: item.type
                }}
              />
            ))}
          </div>

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

      {!loading && !error && filteredResults.length === 0 && searchQuery && (
        <div className={styles.empty}>
          <i className="fas fa-filter"></i>
          <h3>Nenhum resultado encontrado</h3>
          <p>Tente ajustar os filtros ou buscar por outros termos</p>
        </div>
      )}

      {!loading && !error && !searchQuery && (
        <div className={styles.empty}>
          <i className="fas fa-search"></i>
          <h3>Comece sua busca</h3>
          <p>Clique no icone de pesquisa para encontrar filmes e séries</p>
        </div>
      )}
    </div>
  );
};

export default Home;
