import React from 'react';
import styles from './MovieCard.module.css';

const MovieCard = ({ 
  movie, 
  onWatch, 
  onAddToList 
}) => {
  const {
    title,
    rating,
    ageRating,
    year,
    duration,
    genres,
    description,
    poster
  } = movie;

  const handleWatch = (e) => {
    e.stopPropagation();
    onWatch?.(movie);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    onAddToList?.(movie);
  };

  return (
    <div className={styles.movieCard}>
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
            <i className="fas fa-star"></i>
            <span>Popular</span>
          </div>
        </div>

        <div className={styles.content}>
          <div className={styles.basicInfo}>
            <div className={styles.title}>{title}</div>
            <div className={styles.info}>
              <span className={styles.rating}>{rating}% relevante</span>
              <span className={styles.ageRating}>{ageRating}</span>
              <span>{year}</span>
              <span>{duration}</span>
            </div>
          </div>

          <div className={styles.additionalContent}>
            <div className={styles.genre}>
              {genres?.map((genre, index) => (
                <span key={index}>{genre}</span>
              ))}
            </div>

            <div className={styles.description}>
              {description}
            </div>

            <div className={styles.buttons}>
              <button className={styles.playBtn} onClick={handleWatch}>
                <i className="fas fa-play"></i> Assistir
              </button>
              <button className={styles.addBtn} onClick={handleAddToList}>
                <i className="fas fa-plus"></i> Lista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
