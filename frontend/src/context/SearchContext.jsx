import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch deve ser usado dentro de SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    type: ''
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
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
      genre: '',
      type: ''
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
        handleSearch,
        handleFilterChange,
        handlePageChange,
        updatePagination,
        toggleSearch,
        toggleFilters,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
