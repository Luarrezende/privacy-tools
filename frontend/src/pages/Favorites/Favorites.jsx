import React, { useEffect } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import MovieCard from '../../components/ui/MovieCard/MovieCard';
import styles from './Favorites.module.css';

const Favorites = () => {
  const { favorites, getFavoritesStats, clearFavorites } = useFavorites();
  const stats = getFavoritesStats();

  useEffect(() => {
    if (favorites.length > 0 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          message: `Você tem ${stats.total} ${stats.total === 1 ? 'favorito' : 'favoritos'} salvos! 🎬`,
          type: 'info',
          duration: 4000
        }
      }));
    }
  }, []);

  const handleWatch = (movie) => {
    console.log('Assistir:', movie);
  };

  const handleAddToList = (movie) => {
    console.log('Toggle favorito:', movie);
  };

  const handleClearAll = () => {
    if (window.confirm(`Tem certeza que deseja remover todos os ${stats.total} favoritos?`)) {
      clearFavorites();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>
            <i className="fas fa-heart"></i>
            Meus Favoritos
          </h1>
          <p className={styles.subtitle}>
            Sua coleção pessoal de filmes e séries favoritos
          </p>
        </div>

        {stats.total > 0 && (
          <div className={styles.statsSection}>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.total}</span>
                <span className={styles.statLabel}>Total</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.movies}</span>
                <span className={styles.statLabel}>Filmes</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.series}</span>
                <span className={styles.statLabel}>Séries</span>
              </div>
            </div>
            
            <button className={styles.clearBtn} onClick={handleClearAll}>
              <i className="fas fa-trash"></i>
              Limpar Todos
            </button>
          </div>
        )}
      </div>

      {favorites.length > 0 ? (
        <div className={styles.content}>
          <div className={styles.filters}>
            <button className={`${styles.filterBtn} ${styles.active}`}>
              <i className="fas fa-th"></i>
              Todos ({stats.total})
            </button>
            <button className={styles.filterBtn}>
              <i className="fas fa-film"></i>
              Filmes ({stats.movies})
            </button>
            <button className={styles.filterBtn}>
              <i className="fas fa-tv"></i>
              Séries ({stats.series})
            </button>
          </div>

          <div className={styles.grid}>
            {favorites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onWatch={handleWatch}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <i className="fas fa-heart-broken"></i>
          </div>
          <h3 className={styles.emptyTitle}>Nenhum favorito ainda</h3>
          <p className={styles.emptyText}>
            Comece adicionando filmes e séries à sua lista de favoritos
          </p>
          <button className={styles.exploreBtn}>
            <i className="fas fa-search"></i>
            Explorar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
};

export default Favorites;
