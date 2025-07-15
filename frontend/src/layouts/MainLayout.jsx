import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useFavorites } from '../context/FavoritesContext';
import { filterOptions } from '../constants/filters';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { getFavoritesStats } = useFavorites();
  const favoritesStats = getFavoritesStats();
  const {
    searchQuery,
    filters,
    isSearchOpen,
    isFiltersOpen,
    shouldShowSearch,
    handleSearch,
    handleFilterChange,
    toggleSearch,
    toggleFilters,
    clearSearch,
    setIsSearchOpen
  } = useSearch();

  const location = useLocation();

  const handleSearchInput = (e) => {
    handleSearch(e.target.value);
  };

  const handleHomeClick = () => {
    if (!shouldShowSearch()) {
      setTimeout(() => {
        setIsSearchOpen(true);
      }, 100);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleSidebarMouseEnter = () => {
    setIsSidebarExpanded(true);
  };

  const handleSidebarMouseLeave = () => {
    setIsSidebarExpanded(false);
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <nav 
        className={styles.sidebar}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        aria-label="Menu de navegação principal"
      >
        <div className={styles.profilePicWrapper}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
            alt="Foto de perfil"
            className={styles.profilePic}
          />
        </div>

        <div className={styles.sidebarButtons}>
          <Link 
            to="/" 
            className={`${styles.sidebarButton} ${isActive('/') ? styles.active : ''}`}
            onClick={handleHomeClick}
            aria-label="Ir para página inicial"
          >
            <i className="fas fa-home"></i>
            <span>Início</span>
          </Link>

          <button 
            className={styles.sidebarButton}
            onClick={toggleSearch}
            style={{ display: shouldShowSearch() ? 'flex' : 'none' }}
            aria-label="Abrir campo de pesquisa"
          >
            <i className="fas fa-search"></i>
            <span>Pesquisar</span>
          </button>

          <button 
            className={styles.sidebarButton}
            onClick={toggleFilters}
            style={{ display: shouldShowSearch() ? 'flex' : 'none' }}
            aria-label="Abrir filtros de pesquisa"
          >
            <i className="fas fa-filter"></i>
            <span>Filtros</span>
          </button>

          <Link 
              to="/favorites" 
              className={`${styles.sidebarButton} ${isActive('/favorites') ? styles.active : ''}`}
              aria-label='Ir para favoritos'
            >
            <i className="fas fa-heart"></i>
            <span>Favoritos</span>
            {favoritesStats.total > 0 && (
              <span className={styles.badge}>{favoritesStats.total}</span>
            )}
          </Link>
        </div>
      </nav>

      <main className={`${styles.mainContent} ${isSidebarExpanded ? styles.expanded : ''}`}>
        {shouldShowSearch() && (
          <div className={`${styles.searchTop} ${isSearchOpen ? styles.open : ''}`}>
            <i className="fas fa-search"></i>
            <input
              id="searchInput"
              type="text"
              placeholder="Buscar filmes ou séries..."
              value={searchQuery}
              onChange={handleSearchInput}
              aria-label="Campo de busca para filmes e séries"
            />
          </div>
        )}

        {shouldShowSearch() && (
          <div className={`${styles.filtersContainer} ${isFiltersOpen ? styles.open : ''}`}>
            <div className={styles.filtersGrid}>
            <select 
              className={styles.filterField}
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              {filterOptions.types.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className={styles.filterField}
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              {filterOptions.years.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select 
              className={styles.filterField}
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              {filterOptions.sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            </div>

            <div className={styles.filterActions}>
              <button 
                className={styles.clearFiltersBtn}
                onClick={clearSearch}
                aria-label="Limpar todos os filtros"
              >
                <i className="fas fa-times"></i> Limpar Filtros
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo das Páginas */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
