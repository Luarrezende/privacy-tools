import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../../context/FavoritesContext';
import styles from './MovieCard.module.css';

const MovieCard = ({ 
  movie
}) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const {
    title,
    year,
    poster,
    type
  } = movie;

  const handleWatch = (e) => {
    e.stopPropagation();
    // Navegar para a página de detalhes
    handleCardClick();
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const handleCardClick = () => {
    if (type === 'movie') {
      navigate(`/movies/${movie.id}`);
    } else if (type === 'series') {
      navigate(`/series/${movie.id}`);
    }
  };

  const isInFavorites = isFavorite(movie.id);

  return (
    <div className={styles.movieCard} onClick={handleCardClick}>
      <div className={styles.cardInner}>
        <div 
          className={styles.poster}
          style={{ backgroundImage: `url(${poster})` }}
        ></div>
        
        <div className={styles.infoOverlay}></div>

        <div className={styles.toolsLogo}>
          <i className="fas fa-film"></i>
          <span>TOOLS</span>
        </div>

        <div className={styles.badges}>
          <div className={styles.badge}>
            <i className="fas fa-film"></i>
            <span>{type === 'movie' ? 'Filme' : type === 'series' ? 'Série' : 'Conteúdo'}</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.basicInfo}>
            <div className={styles.title}>{title}</div>
            <div className={styles.info}>
              <span className={styles.year}>{year}</span>
            </div>
          </div>

          <div className={styles.additionalContent}>
            <div className={styles.buttons}>
              <button className={styles.playBtn} onClick={handleWatch}>
                <i className="fas fa-play"></i> Assistir
              </button>
              <button 
                className={`${styles.addBtn} ${isInFavorites ? styles.favorite : ''}`} 
                onClick={handleAddToList}
              >
                <i className={isInFavorites ? "fas fa-heart" : "fas fa-plus"}></i> 
                {isInFavorites ? 'Favorito' : 'Lista'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
