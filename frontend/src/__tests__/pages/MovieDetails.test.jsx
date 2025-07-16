import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MovieDetails from '../../pages/MovieDetails/MovieDetails';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' })
  };
});

global.fetch = vi.fn();

describe('MovieDetails', () => {
  const mockMovieData = {
    id: '123',
    title: 'Inception',
    year: '2010',
    plot: 'A skilled thief who steals corporate secrets through the use of dream-sharing technology.',
    genre: 'Action, Sci-Fi, Thriller',
    director: 'Christopher Nolan',
    actors: 'Leonardo DiCaprio, Marion Cotillard, Tom Hardy',
    runtime: '148 min',
    imdbRating: '8.8',
    poster: 'https://example.com/inception.jpg'
  };

  const renderMovieDetails = () => {
    return render(
      <BrowserRouter>
        <MovieDetails />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetch.mockReset();
  });

  it('deve mostrar estado de carregamento', () => {
    fetch.mockImplementation(() => new Promise(() => {}));
    
    renderMovieDetails();
    
    expect(screen.getByText('Carregando detalhes...')).toBeInTheDocument();
    expect(screen.getByText('Carregando detalhes...').parentElement.querySelector('.fas.fa-spinner.fa-spin')).toBeInTheDocument();
  });

  it('deve exibir erro quando API falha', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Filme não encontrado')).toBeInTheDocument();
    });

    expect(screen.getByText('Erro')).toBeInTheDocument();
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('deve exibir erro quando fetch falha', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar detalhes do filme')).toBeInTheDocument();
    });
  });

  it('deve navegar para página anterior ao clicar em voltar', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    renderMovieDetails();

    await waitFor(() => {
      fireEvent.click(screen.getByText('Voltar'));
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('deve carregar e exibir detalhes do filme', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    expect(screen.getByText('Filme')).toBeInTheDocument();
    expect(screen.getByText('2010')).toBeInTheDocument();
    expect(screen.getByText('A skilled thief who steals corporate secrets through the use of dream-sharing technology.')).toBeInTheDocument();
    expect(screen.getByText('Action, Sci-Fi, Thriller')).toBeInTheDocument();
    expect(screen.getByText('Christopher Nolan')).toBeInTheDocument();
    expect(screen.getByText('Leonardo DiCaprio, Marion Cotillard, Tom Hardy')).toBeInTheDocument();
    expect(screen.getByText('148 min')).toBeInTheDocument();
    expect(screen.getByText('8.8/10')).toBeInTheDocument();
  });

  it('deve exibir poster do filme', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByAltText('Inception')).toBeInTheDocument();
    });

    const poster = screen.getByAltText('Inception');
    expect(poster.src).toBe('https://example.com/inception.jpg');
  });

  it('deve exibir placeholder quando poster é N/A', async () => {
    const movieWithoutPoster = { ...mockMovieData, poster: 'N/A' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movieWithoutPoster
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByAltText('Inception')).toBeInTheDocument();
    });

    const poster = screen.getByAltText('Inception');
    expect(poster.src).toContain('unsplash.com');
  });

  it('deve renderizar botões de ação', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Assistir')).toBeInTheDocument();
    });

    expect(screen.getByText('Adicionar aos Favoritos')).toBeInTheDocument();
  });

  it('deve renderizar apenas informações disponíveis', async () => {
    const minimalMovie = {
      id: '123',
      title: 'Minimal Movie'
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => minimalMovie
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Minimal Movie')).toBeInTheDocument();
    });

    expect(screen.queryByText('Sinopse')).not.toBeInTheDocument();
    expect(screen.queryByText('Gênero')).not.toBeInTheDocument();
    expect(screen.queryByText('Diretor')).not.toBeInTheDocument();
    expect(screen.queryByText('Elenco')).not.toBeInTheDocument();
    expect(screen.queryByText('Duração')).not.toBeInTheDocument();
    expect(screen.queryByText('Avaliação IMDb')).not.toBeInTheDocument();
  });

  it('deve fazer fetch com ID correto', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('id=123')
      );
    });
  });

  it('deve exibir erro quando não há filme', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => null
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Filme não encontrado')).toBeInTheDocument();
    });
  });

  it('deve exibir todas as seções quando dados estão disponíveis', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Sinopse')).toBeInTheDocument();
    });

    expect(screen.getByText('Gênero')).toBeInTheDocument();
    expect(screen.getByText('Diretor')).toBeInTheDocument();
    expect(screen.getByText('Elenco')).toBeInTheDocument();
    expect(screen.getByText('Duração')).toBeInTheDocument();
    expect(screen.getByText('Avaliação IMDb')).toBeInTheDocument();
  });

  it('deve exibir badge de filme', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Filme')).toBeInTheDocument();
    });

    expect(screen.getByText('Filme').parentElement.querySelector('.fas.fa-film')).toBeInTheDocument();
  });

  it('deve exibir badge de ano quando disponível', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovieData
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('2010')).toBeInTheDocument();
    });

    expect(screen.getByText('2010').parentElement.querySelector('.fas.fa-calendar')).toBeInTheDocument();
  });

  it('deve não exibir badge de ano quando não disponível', async () => {
    const movieWithoutYear = { ...mockMovieData, year: null };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movieWithoutYear
    });

    renderMovieDetails();

    await waitFor(() => {
      expect(screen.getByText('Inception')).toBeInTheDocument();
    });

    expect(screen.queryByText('2010')).not.toBeInTheDocument();
  });
});
