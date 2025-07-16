import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import MovieCard from '../../../../components/ui/MovieCard/MovieCard';
import { FavoritesProvider } from '../../../../context/FavoritesContext';

const mockNavigate = vi.fn();
const mockToggleFavorite = vi.fn();
const mockIsFavorite = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

vi.mock('../../../../context/FavoritesContext', () => ({
    useFavorites: () => ({
        toggleFavorite: mockToggleFavorite,
        isFavorite: mockIsFavorite,
    }),
    FavoritesProvider: ({ children }) => children,
}));

vi.mock('../../../../utils/contentTypes', () => ({
    isTVType: vi.fn((type) => type === 'tv' || type === 'series'),
    isMovieType: vi.fn((type) => type === 'movie'),
    getContentTypeLabel: vi.fn((type) => type === 'movie' ? 'Filme' : 'Série'),
    getContentTypeIcon: vi.fn((type) => type === 'movie' ? 'fas fa-film' : 'fas fa-tv'),
}));

describe('MovieCard Component', () => {
    const mockMovieData = {
        id: 1,
        title: 'Batman',
        year: '2022',
        poster: 'batman.jpg',
        type: 'movie'
    };

    const mockSeriesData = {
        id: 2,
        title: 'Breaking Bad',
        year: '2008',
        poster: 'breaking-bad.jpg',
        type: 'tv'
    };

    const renderMovieCard = (movie) => {
        return render(
            <BrowserRouter>
                <FavoritesProvider>
                    <MovieCard movie={movie} />
                </FavoritesProvider>
            </BrowserRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockIsFavorite.mockReturnValue(false);
    });

    describe('Teste do botão Assistir', () => {
        it('deve navegar para página do filme ao clicar em Assistir', () => {
            renderMovieCard(mockMovieData);
            
            const watchButton = screen.getByText('Assistir');
            fireEvent.click(watchButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/movies/1');
        });

        it('deve navegar para página da série ao clicar em Assistir', () => {
            renderMovieCard(mockSeriesData);
            
            const watchButton = screen.getByText('Assistir');
            fireEvent.click(watchButton);
            
            expect(mockNavigate).toHaveBeenCalledWith('/series/2');
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });
    });

    describe('Teste do botão Lista', () => {
        it('deve adicionar item à lista de favoritos', () => {
            renderMovieCard(mockMovieData);
            
            const addButton = screen.getByText('Lista');
            fireEvent.click(addButton);
            
            expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovieData);
        });
    });

    describe('Teste do clique no card', () => {
        it('deve navegar para página de filme quando type é movie', () => {
            renderMovieCard(mockMovieData);
            
            const card = screen.getByText('Batman').closest('div[class*="movieCard"]');
            fireEvent.click(card);
            
            expect(mockNavigate).toHaveBeenCalledWith('/movies/1');
        });

        it('deve navegar para página de série quando type é tv', () => {
            renderMovieCard(mockSeriesData);
            
            const card = screen.getByText('Breaking Bad').closest('div[class*="movieCard"]');
            fireEvent.click(card);
            
            expect(mockNavigate).toHaveBeenCalledWith('/series/2');
        });

        it('deve navegar para página de série quando type é series', () => {
            const seriesData = { ...mockSeriesData, type: 'series' };
            renderMovieCard(seriesData);
            
            const card = screen.getByText('Breaking Bad').closest('div[class*="movieCard"]');
            fireEvent.click(card);
            
            expect(mockNavigate).toHaveBeenCalledWith('/series/2');
        });

        it('não deve navegar quando type não é reconhecido', () => {
            const unknownData = { ...mockMovieData, type: 'unknown' };
            renderMovieCard(unknownData);
            
            const card = screen.getByText('Batman').closest('div[class*="movieCard"]');
            fireEvent.click(card);
            
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe('Teste de integração dos eventos', () => {
        it('deve funcionar corretamente com item já favoritado', () => {
            mockIsFavorite.mockReturnValue(true);
            renderMovieCard(mockMovieData);
            
            const favoriteButton = screen.getByText('Favorito');
            expect(favoriteButton).toBeInTheDocument();
            
            fireEvent.click(favoriteButton);
            expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovieData);
        });

        it('deve funcionar corretamente com item não favoritado', () => {
            mockIsFavorite.mockReturnValue(false);
            renderMovieCard(mockMovieData);
            
            const addButton = screen.getByText('Lista');
            expect(addButton).toBeInTheDocument();
            
            fireEvent.click(addButton);
            expect(mockToggleFavorite).toHaveBeenCalledWith(mockMovieData);
        });
    });
});
