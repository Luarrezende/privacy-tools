import React, { createContext, useContext, useState, useEffect } from 'react';
import { isMovieType, isTVType } from '../utils/contentTypes';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('privacy-tools-favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setFavorites([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('privacy-tools-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie, showNotification = true) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === movie.id);
      if (exists) {
        return prev;
      }
      
      if (showNotification && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            message: `${movie.title} foi adicionado aos favoritos! ❤️`,
            type: 'success',
            duration: 3000
          }
        }));
      }
      
      return [...prev, { ...movie, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromFavorites = (movieId, showNotification = true) => {
    setFavorites(prev => {
      const movieToRemove = prev.find(fav => fav.id === movieId);
      if (movieToRemove && showNotification && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: {
            message: `${movieToRemove.title} foi removido dos favoritos`,
            type: 'info',
            duration: 3000
          }
        }));
      }
      return prev.filter(fav => fav.id !== movieId);
    });
  };

  const isFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };

  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  const clearFavorites = () => {
    const count = favorites.length;
    setFavorites([]);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: {
          message: `${count} ${count === 1 ? 'favorito foi removido' : 'favoritos foram removidos'}`,
          type: 'warning',
          duration: 3000
        }
      }));
    }
  };

  const getFavoritesStats = () => {
    const movies = favorites.filter(fav => isMovieType(fav.type));
    const series = favorites.filter(fav => isTVType(fav.type));
    
    return {
      total: favorites.length,
      movies: movies.length,
      series: series.length
    };
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        getFavoritesStats
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
