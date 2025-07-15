import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import App from '../../../App';
import { MockSearchProvider, MockFavoritesProvider, MockNotificationProvider } from '../../__mocks__/contextMocks';
import * as FavoritesContext from '../../../context/FavoritesContext';
import * as SearchContext from '../../../context/SearchContext';

// Mock dos hooks principais
vi.mock('../../../context/FavoritesContext', () => ({
    useFavorites: vi.fn(),
    FavoritesProvider: ({ children }) => children,
}));

vi.mock('../../../context/SearchContext', () => ({
    useSearch: vi.fn(),
    SearchProvider: ({ children }) => children,
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(() => ({ pathname: '/' })),
    };
});

describe('Home Page Component', () => {
    const defaultSearchMock = {
        searchQuery: '',
        filters: { year: '', type: '', sortBy: 'relevance' },
        isSearchOpen: false,
        isFiltersOpen: false,
        shouldShowSearch: vi.fn().mockReturnValue(true),
        handleSearch: vi.fn(),
        handleFilterChange: vi.fn(),
        toggleSearch: vi.fn(),
        toggleFilters: vi.fn(),
        clearSearch: vi.fn(),
        setIsSearchOpen: vi.fn(),
        pagination: { currentPage: 1, totalPages: 0, totalResults: 0, hasNextPage: false, hasPreviousPage: false },
        handlePageChange: vi.fn(),
        updatePagination: vi.fn(),
    };

    const defaultFavoritesMock = {
        favorites: [],
        addToFavorites: vi.fn(),
        removeFromFavorites: vi.fn(),
        isFavorite: vi.fn().mockReturnValue(false),
        clearFavorites: vi.fn(),
        getFavoritesStats: vi.fn().mockReturnValue({ total: 0, movies: 0, series: 0 }),
    };

    beforeEach(() => {
        vi.mocked(SearchContext.useSearch).mockReturnValue(defaultSearchMock);
        vi.mocked(FavoritesContext.useFavorites).mockReturnValue(defaultFavoritesMock);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    const renderApp = () => {
        render(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <App />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );
    };

    it('deve renderizar a página inicial com elementos essenciais', () => {
        renderApp();
        
        expect(screen.getByText('Comece sua busca')).toBeInTheDocument();
        expect(screen.getByText('Clique no icone de pesquisa para encontrar filmes e séries')).toBeInTheDocument();
        
        expect(screen.getByRole('navigation', { name: /menu de navegação principal/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ir para página inicial/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ir para favoritos/i })).toBeInTheDocument();
        
        expect(screen.getByRole('button', { name: /abrir campo de pesquisa/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /abrir filtros de pesquisa/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /campo de busca para filmes e séries/i })).toBeInTheDocument();
    });

    it('deve permitir interagir com o campo de busca', async () => {
        const mockHandleSearch = vi.fn();
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            isSearchOpen: true,
            handleSearch: mockHandleSearch,
        });

        renderApp();
        const user = userEvent.setup();
        
        const searchInput = screen.getByRole('textbox', { name: /campo de busca para filmes e séries/i });
        
        await user.click(searchInput);
        await user.type(searchInput, 'batman');
        
        expect(mockHandleSearch).toHaveBeenCalled();
    });

    it('deve exibir badge quando há favoritos', () => {
        vi.mocked(FavoritesContext.useFavorites).mockReturnValue({
            ...defaultFavoritesMock,
            getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 }),
        });

        renderApp();
        
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ir para favoritos/i })).toBeInTheDocument();
    });

    it('deve ocultar elementos de busca quando não está na página inicial', () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            shouldShowSearch: vi.fn().mockReturnValue(false),
        });

        renderApp();
        
        expect(screen.queryByRole('textbox', { name: /campo de busca para filmes e séries/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /abrir campo de pesquisa/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /abrir filtros de pesquisa/i })).not.toBeInTheDocument();
        
        expect(screen.getByRole('link', { name: /ir para página inicial/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ir para favoritos/i })).toBeInTheDocument();
    });

    it('deve exibir filtros quando isFiltersOpen é true', () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            isFiltersOpen: true,
        });

        renderApp();
        
        expect(screen.getByRole('button', { name: /limpar todos os filtros/i })).toBeInTheDocument();
    });

    it('deve permitir hover na sidebar', async () => {
        renderApp();
        const user = userEvent.setup();
        
        const sidebar = screen.getByRole('navigation', { name: /menu de navegação principal/i });
        
        await user.hover(sidebar);
        await user.unhover(sidebar);
        
        expect(screen.getByRole('link', { name: /ir para página inicial/i })).toBeInTheDocument();
    });

    it('deve abrir busca ao clicar em "Início" quando não está na home', async () => {
        const mockSetIsSearchOpen = vi.fn();
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            shouldShowSearch: vi.fn().mockReturnValue(false),
            setIsSearchOpen: mockSetIsSearchOpen,
        });

        renderApp();
        const user = userEvent.setup();
        
        const homeButton = screen.getByRole('link', { name: /ir para página inicial/i });
        await user.click(homeButton);
        
        await waitFor(() => {
            expect(mockSetIsSearchOpen).toHaveBeenCalledWith(true);
        }, { timeout: 200 });
    });
});
