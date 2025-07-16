import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Home from '../../../pages/Home/Home';
import { MockSearchProvider, MockFavoritesProvider, MockNotificationProvider } from '../../__mocks__/contextMocks';
import * as FavoritesContext from '../../../context/FavoritesContext';
import * as SearchContext from '../../../context/SearchContext';

global.fetch = vi.fn();

vi.mock('../../../context/FavoritesContext', () => ({
    useFavorites: vi.fn(),
    FavoritesProvider: ({ children }) => children,
}));

vi.mock('../../../context/SearchContext', () => ({
    useSearch: vi.fn(),
    SearchProvider: ({ children }) => children,
}));

vi.mock('../../../utils/deduplication', () => ({
    deduplicateMoviesAndSeries: vi.fn((movies, series) => [
        ...movies.map(m => ({ ...m, type: 'movie' })),
        ...series.map(s => ({ ...s, type: 'series' }))
    ]),
    checkDataIntegrity: vi.fn(() => ({
        isValid: true,
        report: { duplicateIds: [] }
    }))
}));

describe('Home Page Component - Cenários com Dados', () => {
    const mockMoviesData = [
        { id: 1, title: 'Batman Begins', year: '2005', poster: 'batman1.jpg' },
        { id: 2, title: 'The Dark Knight', year: '2008', poster: 'batman2.jpg' }
    ];

    const mockSeriesData = [
        { id: 1, title: 'Batman: The Animated Series', year: '1992', poster: 'batman_series.jpg' },
        { id: 2, title: 'Gotham', year: '2014', poster: 'gotham.jpg' }
    ];

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
        clearFilters: vi.fn(),
        setIsSearchOpen: vi.fn(),
        pagination: { currentPage: 1, totalPages: 1, totalResults: 0, hasNextPage: false, hasPreviousPage: false },
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
        
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ results: [] })
        });
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        global.fetch.mockClear();
    });

    const renderHome = () => {
        return render(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Home />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );
    };

    it('deve fazer busca na API quando há searchQuery', async () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'batman',
        });

        global.fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockMoviesData
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockSeriesData
            });

        renderHome();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('movies/searchall?title=batman'),
            expect.objectContaining({ signal: expect.any(AbortSignal) })
        );
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('series/searchall?title=batman'),
            expect.objectContaining({ signal: expect.any(AbortSignal) })
        );
    });

    it('deve exibir loading durante busca', async () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'batman',
        });

        global.fetch.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: async () => []
            }), 100))
        );

        renderHome();

        expect(screen.queryByText('Resultados da Busca')).not.toBeInTheDocument();
    });

    it('deve lidar com erro da API', async () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'batman',
        });

        global.fetch.mockRejectedValue(new Error('Network error'));

        renderHome();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });

        expect(screen.queryByText('Network error')).not.toBeInTheDocument();
    });

    it('deve lidar com resposta de API inválida', async () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'batman',
        });

        global.fetch.mockResolvedValue({
            ok: false,
            status: 404
        });

        renderHome();

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });

        expect(screen.getByText('Nenhum resultado encontrado')).toBeInTheDocument();
        expect(screen.getByText('Tente ajustar os filtros ou buscar por outros termos')).toBeInTheDocument();
    });

    it('deve cancelar requisições quando uma nova busca é feita', async () => {
        const { rerender } = render(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Home />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );

        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'batman',
        });

        rerender(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Home />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );

        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'superman',
        });

        rerender(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Home />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled();
        });
    });

    it('deve aplicar debounce na busca', async () => {
        const { rerender } = render(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Home />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );

        ['b', 'ba', 'bat', 'batm', 'batman'].forEach((query, index) => {
            vi.mocked(SearchContext.useSearch).mockReturnValue({
                ...defaultSearchMock,
                searchQuery: query,
            });

            rerender(
                <MockSearchProvider>
                    <MockFavoritesProvider>
                        <MockNotificationProvider>
                            <Home />
                        </MockNotificationProvider>
                    </MockFavoritesProvider>
                </MockSearchProvider>
            );
        });

        await new Promise(resolve => setTimeout(resolve, 600));

        expect(global.fetch).toHaveBeenCalled();
    });

    it('deve limpar resultados quando search query é vazio', async () => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: 'batman',
        });

        const { rerender } = renderHome();

        await waitFor(() => {
            expect(screen.getByText('Buscando...')).toBeInTheDocument();
        });

        vi.mocked(SearchContext.useSearch).mockReturnValue({
            ...defaultSearchMock,
            searchQuery: '',
        });

        rerender(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Home />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('Comece sua busca')).toBeInTheDocument();
        });
    });
});
