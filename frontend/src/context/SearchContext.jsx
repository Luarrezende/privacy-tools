import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch deve ser usado dentro de SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    type: '',
    sortBy: 'relevance'
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  // Função para verificar se devemos mostrar a barra de pesquisa
  const shouldShowSearch = () => {
    const currentPath = location.pathname;
    // Mostrar apenas na página inicial (/)
    // Esconder nas páginas de detalhes (/movies/:id, /series/:id, /seasons, /episodes, etc.) e favoritos
    return currentPath === '/';
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    
    // Se não estiver na página inicial, navegar para ela
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
    
    // Se não estiver na página inicial, navegar para ela
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const updatePagination = (moviesPagination, seriesPagination) => {
    const totalMovies = moviesPagination?.totalResults || 0;
    const totalSeries = seriesPagination?.totalResults || 0;
    const totalResults = totalMovies + totalSeries;
    
    // Calcula páginas baseado na média das páginas dos dois endpoints
    const avgTotalPages = Math.max(
      moviesPagination?.totalPages || 0,
      seriesPagination?.totalPages || 0
    );
    
    setPagination(prev => ({
      ...prev,
      totalResults,
      totalPages: avgTotalPages,
      hasNextPage: moviesPagination?.hasNextPage || seriesPagination?.hasNextPage || false,
      hasPreviousPage: prev.currentPage > 1
    }));
  };

  const toggleSearch = () => {
    // Se não estiver na página inicial, navegar para ela primeiro
    if (location.pathname !== '/') {
      navigate('/');
    }
    
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('searchInput')?.focus();
      }, 100);
    }
  };

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilters({
      year: '',
      type: '',
      sortBy: 'relevance'
    });
    setPagination({
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      hasNextPage: false,
      hasPreviousPage: false
    });
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        filters,
        isSearchOpen,
        isFiltersOpen,
        pagination,
        shouldShowSearch,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        updatePagination,
        toggleSearch,
        toggleFilters,
        clearSearch,
        setIsSearchOpen
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
