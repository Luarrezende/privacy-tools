import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    type: ''
  });

  const location = useLocation();

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.getElementById('searchInput')?.focus();
      }, 100);
    }
  };

  const handleFiltersToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <nav className={styles.sidebar}>
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
          >
            <i className="fas fa-home"></i>
            <span>Início</span>
          </Link>

          <button 
            className={styles.sidebarButton}
            onClick={handleSearchToggle}
          >
            <i className="fas fa-search"></i>
            <span>Pesquisar</span>
          </button>

          <button 
            className={styles.sidebarButton}
            onClick={handleFiltersToggle}
          >
            <i className="fas fa-filter"></i>
            <span>Filtros</span>
          </button>

          <Link 
            to="/movies" 
            className={`${styles.sidebarButton} ${isActive('/movies') ? styles.active : ''}`}
          >
            <i className="fas fa-film"></i>
            <span>Filmes</span>
          </Link>

          <Link 
            to="/series" 
            className={`${styles.sidebarButton} ${isActive('/series') ? styles.active : ''}`}
          >
            <i className="fas fa-tv"></i>
            <span>Séries</span>
          </Link>

          <Link 
            to="/favorites" 
            className={`${styles.sidebarButton} ${isActive('/favorites') ? styles.active : ''}`}
          >
            <i className="fas fa-heart"></i>
            <span>Favoritos</span>
          </Link>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className={styles.mainContent}>
        {/* Campo de Busca */}
        <div className={`${styles.searchTop} ${isSearchOpen ? styles.open : ''}`}>
          <i className="fas fa-search"></i>
          <input
            id="searchInput"
            type="text"
            placeholder="Buscar filmes ou séries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className={`${styles.filtersContainer} ${isFiltersOpen ? styles.open : ''}`}>
          <input
            type="number"
            className={styles.filterField}
            placeholder="Ano"
            min="1900"
            max="2099"
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
          />
          
          <select 
            className={styles.filterField}
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
          >
            <option value="">Gênero</option>
            <option value="drama">Drama</option>
            <option value="ficcao">Ficção</option>
            <option value="comedia">Comédia</option>
            <option value="fantasia">Fantasia</option>
          </select>

          <select 
            className={styles.filterField}
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">Tipo</option>
            <option value="filme">Filme</option>
            <option value="serie">Série</option>
          </select>
        </div>

        {/* Conteúdo das Páginas */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
