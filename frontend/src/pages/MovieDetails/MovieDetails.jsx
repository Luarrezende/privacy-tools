import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiBaseUrlL, apiEndpoints } from '../../constants/api';
import styles from './MovieDetails.module.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiBaseUrlL}${apiEndpoints.movies.details}?id=${id}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Movie details response:', data);
          setMovie(data);
        } else {
          setError('Filme não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme:', err);
        setError('Erro ao carregar detalhes do filme');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando detalhes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Erro</h2>
          <p>{error}</p>
          <button onClick={handleGoBack} className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <i className="fas fa-film"></i>
          <h2>Filme não encontrado</h2>
          <button onClick={handleGoBack} className={styles.backButton}>
            <i className="fas fa-arrow-left"></i>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={handleGoBack} className={styles.backButton}>
        <i className="fas fa-arrow-left"></i>
        Voltar
      </button>

      <div className={styles.movieDetails}>
        <div className={styles.posterSection}>
          <img 
            src={movie.poster !== 'N/A' ? movie.poster : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80'} 
            alt={movie.title}
            className={styles.poster}
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <h1 className={styles.title}>{movie.title}</h1>
            <div className={styles.badges}>
              <span className={styles.badge}>
                <i className="fas fa-film"></i>
                Filme
              </span>
              {movie.year && (
                <span className={styles.badge}>
                  <i className="fas fa-calendar"></i>
                  {movie.year}
                </span>
              )}
            </div>
          </div>

          {movie.plot && (
            <div className={styles.section}>
              <h3>Sinopse</h3>
              <p>{movie.plot}</p>
            </div>
          )}

          {movie.genre && (
            <div className={styles.section}>
              <h3>Gênero</h3>
              <p>{movie.genre}</p>
            </div>
          )}

          {movie.director && (
            <div className={styles.section}>
              <h3>Diretor</h3>
              <p>{movie.director}</p>
            </div>
          )}

          {movie.actors && (
            <div className={styles.section}>
              <h3>Elenco</h3>
              <p>{movie.actors}</p>
            </div>
          )}

          {movie.runtime && (
            <div className={styles.section}>
              <h3>Duração</h3>
              <p>{movie.runtime}</p>
            </div>
          )}

          {movie.imdbRating && (
            <div className={styles.section}>
              <h3>Avaliação IMDb</h3>
              <p>{movie.imdbRating}/10</p>
            </div>
          )}

          <div className={styles.actions}>
            <button className={styles.watchButton}>
              <i className="fas fa-play"></i>
              Assistir
            </button>
            <button className={styles.favoriteButton}>
              <i className="fas fa-heart"></i>
              Adicionar aos Favoritos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
