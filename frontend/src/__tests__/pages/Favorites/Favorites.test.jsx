import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Favorites from '../../../pages/Favorites/Favorites';
import { MockFavoritesProvider, MockNotificationProvider } from '../../__mocks__/contextMocks';
import * as FavoritesContext from '../../../context/FavoritesContext';

vi.mock('../../../context/FavoritesContext', () => ({
    useFavorites: vi.fn(),
    FavoritesProvider: ({ children }) => children,
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(() => vi.fn()),
    };
});

vi.mock('../../../components/ui/MovieCard/MovieCard', () => ({
    default: ({ movie, onWatch, onAddToList }) => {
        const typeLabel = movie.type === 'movie' ? 'filme' : 'série';
        const article = movie.type === 'movie' ? 'do' : 'da';
        return (
            <div 
                data-testid={`movie-card-${movie.id}`}
                aria-label={`Card ${article} ${typeLabel} ${movie.title}`}
            >
                <h3>{movie.title}</h3>
                <p>{movie.year}</p>
                <p>{movie.type === 'movie' ? 'Filme' : 'Série'}</p>
                <button 
                    onClick={() => onWatch(movie)}
                    aria-label={`Assistir ${movie.title}`}
                >
                    Assistir
                </button>
                <button 
                    onClick={() => onAddToList(movie)}
                    aria-label={`Remover ${movie.title} dos favoritos`}
                >
                    Favoritar
                </button>
            </div>
        );
    }
}));

Object.defineProperty(window, 'confirm', {
    writable: true,
    value: vi.fn(),
});

Object.defineProperty(window, 'dispatchEvent', {
    writable: true,
    value: vi.fn(),
});

describe('Favorites Page Component', () => {
    const defaultFavoritesMock = {
        favorites: [],
        addToFavorites: vi.fn(),
        removeFromFavorites: vi.fn(),
        isFavorite: vi.fn().mockReturnValue(false),
        clearFavorites: vi.fn(),
        toggleFavorite: vi.fn(),
        getFavoritesStats: vi.fn().mockReturnValue({ total: 0, movies: 0, series: 0 }),
    };

    const mockMovies = [
        {
            id: '1',
            title: 'Batman Begins',
            year: '2005',
            type: 'movie',
            poster: 'https://example.com/batman.jpg'
        },
        {
            id: '2',
            title: 'Breaking Bad',
            year: '2008',
            type: 'series',
            poster: 'https://example.com/breaking-bad.jpg'
        },
        {
            id: '3',
            title: 'The Dark Knight',
            year: '2008',
            type: 'movie',
            poster: 'https://example.com/dark-knight.jpg'
        }
    ];

    beforeEach(() => {
        vi.mocked(FavoritesContext.useFavorites).mockReturnValue(defaultFavoritesMock);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    const renderFavorites = (customMock = {}) => {
        const mockData = { ...defaultFavoritesMock, ...customMock };
        vi.mocked(FavoritesContext.useFavorites).mockReturnValue(mockData);
        
        render(
            <BrowserRouter>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Favorites />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </BrowserRouter>
        );
    };

    it('deve renderizar mensagem de lista vazia quando não há favoritos', () => {
        renderFavorites();
        
        expect(screen.getByRole('heading', { name: /meus favoritos/i })).toBeInTheDocument();
        expect(screen.getByText('Sua coleção pessoal de filmes e séries favoritos')).toBeInTheDocument();
        
        expect(screen.getByText('Nenhum favorito ainda')).toBeInTheDocument();
        expect(screen.getByText('Comece adicionando filmes e séries à sua lista de favoritos')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /explorar conteúdo/i })).toBeInTheDocument();
        
        expect(screen.queryByText('Total')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /limpar todos/i })).not.toBeInTheDocument();
    });

    it('deve renderizar lista de favoritos quando há itens', () => {
        renderFavorites({
            favorites: mockMovies,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 })
        });
        
        expect(screen.getByRole('heading', { name: /meus favoritos/i })).toBeInTheDocument();
        
        expect(screen.getByText('3')).toBeInTheDocument(); // Total
        expect(screen.getByText('2')).toBeInTheDocument(); // Filmes
        expect(screen.getByText('1')).toBeInTheDocument(); // Séries
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('Filmes')).toBeInTheDocument();
        expect(screen.getByText('Séries')).toBeInTheDocument();
        
        expect(screen.getByRole('button', { name: /limpar todos/i })).toBeInTheDocument();
        
        expect(screen.getByRole('button', { name: /todos \(3\)/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /filmes \(2\)/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /séries \(1\)/i })).toBeInTheDocument();
        
        expect(screen.queryByText('Nenhum favorito ainda')).not.toBeInTheDocument();
    });

    it('deve renderizar cards para cada filme/série nos favoritos', () => {
        renderFavorites({
            favorites: mockMovies,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 })
        });
        
        expect(screen.getByTestId('movie-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('movie-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('movie-card-3')).toBeInTheDocument();
        
        expect(screen.getByText('Batman Begins')).toBeInTheDocument();
        expect(screen.getByText('Breaking Bad')).toBeInTheDocument();
        expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
        
        expect(screen.getByLabelText(/card do filme Batman Begins/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/card da série Breaking Bad/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/card do filme The Dark Knight/i)).toBeInTheDocument();
    });

    it('deve abrir confirmação e limpar favoritos ao clicar em "Limpar Todos"', async () => {
        const mockClearFavorites = vi.fn();
        const user = userEvent.setup();
        
        vi.mocked(window.confirm).mockReturnValue(true);
        
        renderFavorites({
            favorites: mockMovies,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 }),
            clearFavorites: mockClearFavorites
        });
        
        const clearButton = screen.getByRole('button', { name: /limpar todos/i });
        await user.click(clearButton);
        
        expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja remover todos os 3 favoritos?');
        
        expect(mockClearFavorites).toHaveBeenCalled();
    });

    it('não deve limpar favoritos se usuário cancelar confirmação', async () => {
        const mockClearFavorites = vi.fn();
        const user = userEvent.setup();
        
        vi.mocked(window.confirm).mockReturnValue(false);
        
        renderFavorites({
            favorites: mockMovies,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 }),
            clearFavorites: mockClearFavorites
        });
        
        const clearButton = screen.getByRole('button', { name: /limpar todos/i });
        await user.click(clearButton);
        
        expect(window.confirm).toHaveBeenCalled();
        
        expect(mockClearFavorites).not.toHaveBeenCalled();
    });

    it('deve disparar notificação quando há favoritos na montagem', () => {
        renderFavorites({
            favorites: mockMovies,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 })
        });
        
        expect(window.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'showNotification',
                detail: expect.objectContaining({
                    message: 'Você tem 3 favoritos salvos! 🎬',
                    type: 'info',
                    duration: 4000
                })
            })
        );
    });

    it('não deve disparar notificação quando não há favoritos', () => {
        renderFavorites();
        
        expect(window.dispatchEvent).not.toHaveBeenCalled();
    });

    it('deve permitir clicar no botão "Assistir" dos cards', async () => {
        const user = userEvent.setup();
        
        renderFavorites({
            favorites: [mockMovies[0]],
            getFavoritesStats: vi.fn().mockReturnValue({ total: 1, movies: 1, series: 0 })
        });
        
        const watchButton = screen.getByRole('button', { name: /assistir batman begins/i });
        expect(watchButton).toBeInTheDocument();
        
        await user.click(watchButton);
        
        expect(watchButton).toBeInTheDocument();
    });

    it('deve exibir filtros com contadores corretos', () => {
        renderFavorites({
            favorites: mockMovies,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 })
        });
        
        const allFilter = screen.getByRole('button', { name: /todos \(3\)/i });
        const moviesFilter = screen.getByRole('button', { name: /filmes \(2\)/i });
        const seriesFilter = screen.getByRole('button', { name: /séries \(1\)/i });
        
        expect(allFilter).toBeInTheDocument();
        expect(moviesFilter).toBeInTheDocument();
        expect(seriesFilter).toBeInTheDocument();
        expect(allFilter).toBeInTheDocument();
    });

    it('deve usar singular na notificação quando há apenas 1 favorito', () => {
        renderFavorites({
            favorites: [mockMovies[0]],
            getFavoritesStats: vi.fn().mockReturnValue({ total: 1, movies: 1, series: 0 })
        });

        expect(window.dispatchEvent).toHaveBeenCalledWith(
            expect.objectContaining({
                detail: expect.objectContaining({
                    message: 'Você tem 1 favorito salvos! 🎬'
                })
            })
        );
    });
});
