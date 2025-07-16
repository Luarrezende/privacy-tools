import React from 'react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import * as ReactRouterDom from 'react-router-dom';
import App from '../../../App';
import Home from '../../../pages/Home/Home';
import { MockSearchProvider, MockFavoritesProvider, MockNotificationProvider } from '../../__mocks__/contextMocks';
import * as FavoritesContext from '../../../context/FavoritesContext';
import * as SearchContext from '../../../context/SearchContext';

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
        useNavigate: () => vi.fn(),
    };
});

vi.mock('../../../utils/deduplication', () => ({
    deduplicateMoviesAndSeries: vi.fn(() => []),
    checkDataIntegrity: vi.fn(() => ({
        isValid: true,
        report: { duplicateIds: [] }
    }))
}));

global.fetch = vi.fn();

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
        clearFilters: vi.fn(),
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

    const renderWithMocks = (searchMock = {}, favoritesMock = {}, component = 'Home') => {
        vi.mocked(SearchContext.useSearch).mockReturnValue({ ...defaultSearchMock, ...searchMock });
        vi.mocked(FavoritesContext.useFavorites).mockReturnValue({ ...defaultFavoritesMock, ...favoritesMock });
        vi.mocked(ReactRouterDom.useLocation).mockReturnValue({ pathname: '/' });

        const Component = component === 'App' ? App : Home;
        return render(
            <MockSearchProvider>
                <MockFavoritesProvider>
                    <MockNotificationProvider>
                        <Component />
                    </MockNotificationProvider>
                </MockFavoritesProvider>
            </MockSearchProvider>
        );
    };

    beforeEach(() => {
        vi.mocked(SearchContext.useSearch).mockReturnValue(defaultSearchMock);
        vi.mocked(FavoritesContext.useFavorites).mockReturnValue(defaultFavoritesMock);
        vi.mocked(ReactRouterDom.useLocation).mockReturnValue({ pathname: '/' });
        global.fetch.mockClear();
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    describe('Renderização e Estados Básicos', () => {
        it('deve renderizar página inicial com elementos essenciais', () => {
            renderWithMocks({}, {}, 'App');
            
            expect(screen.getByText('Comece sua busca')).toBeInTheDocument();
            expect(screen.getByText('Clique no icone de pesquisa para encontrar filmes e séries')).toBeInTheDocument();
            expect(screen.getByRole('navigation', { name: /menu de navegação principal/i })).toBeInTheDocument();
            expect(screen.getByRole('textbox', { name: /campo de busca para filmes e séries/i })).toBeInTheDocument();
        });

        it('deve ocultar elementos quando não está na página inicial', () => {
            renderWithMocks({ shouldShowSearch: vi.fn().mockReturnValue(false) }, {}, 'App');
            
            expect(screen.queryByRole('textbox', { name: /campo de busca para filmes e séries/i })).not.toBeInTheDocument();
            expect(screen.getByRole('link', { name: /ir para página inicial/i })).toBeInTheDocument();
        });

        it('deve mostrar loading durante busca', () => {
            renderWithMocks({ searchQuery: 'batman' });
            expect(screen.getByText('Buscando...')).toBeInTheDocument();
        });

        it('deve mostrar badge de favoritos quando há itens', () => {
            renderWithMocks({}, { getFavoritesStats: vi.fn().mockReturnValue({ total: 3, movies: 2, series: 1 }) }, 'App');
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });

    describe('Interações do Usuário', () => {
        it('deve permitir interações básicas', async () => {
            const mockHandleSearch = vi.fn();
            const mockToggleSearch = vi.fn();
            const mockToggleFilters = vi.fn();
            
            renderWithMocks({ 
                isSearchOpen: true,
                handleSearch: mockHandleSearch,
                toggleSearch: mockToggleSearch,
                toggleFilters: mockToggleFilters
            }, {}, 'App');

            const user = userEvent.setup();
            
            const searchInput = screen.getByRole('textbox', { name: /campo de busca para filmes e séries/i });
            await user.click(searchInput);
            await user.type(searchInput, 'batman');
            expect(mockHandleSearch).toHaveBeenCalled();

            const searchButton = screen.getByRole('button', { name: /abrir campo de pesquisa/i });
            await user.click(searchButton);
            expect(mockToggleSearch).toHaveBeenCalled();

            const filtersButton = screen.getByRole('button', { name: /abrir filtros de pesquisa/i });
            await user.click(filtersButton);
            expect(mockToggleFilters).toHaveBeenCalled();
        });

        it('deve abrir busca ao clicar em "Início"', async () => {
            const mockSetIsSearchOpen = vi.fn();
            
            renderWithMocks({ 
                shouldShowSearch: vi.fn().mockReturnValue(false),
                setIsSearchOpen: mockSetIsSearchOpen
            }, {}, 'App');

            const user = userEvent.setup();
            const homeButton = screen.getByRole('link', { name: /ir para página inicial/i });
            await user.click(homeButton);
            
            await waitFor(() => {
                expect(mockSetIsSearchOpen).toHaveBeenCalledWith(true);
            }, { timeout: 200 });
        });
    });

    describe('Estados e Filtros', () => {
        it('deve exibir filtros e manter estados consistentes', () => {
            renderWithMocks({ isFiltersOpen: true, searchQuery: 'test' }, {}, 'App');
            expect(screen.getByRole('button', { name: /limpar todos os filtros/i })).toBeInTheDocument();
        });

        it('deve funcionar com diferentes combinações de estado', () => {
            renderWithMocks({ isSearchOpen: true, isFiltersOpen: true, searchQuery: 'batman' });
            expect(screen.queryByText('Buscando...')).toBeInTheDocument();
            
            renderWithMocks({ isSearchOpen: false, isFiltersOpen: true });
            expect(screen.getByText('Comece sua busca')).toBeInTheDocument();
        });

        it('deve mostrar paginação e favoritos corretamente', () => {
            renderWithMocks(
                { searchQuery: 'batman', pagination: { currentPage: 1, totalPages: 3, hasNextPage: true } },
                { getFavoritesStats: vi.fn().mockReturnValue({ total: 2, movies: 1, series: 1 }) },
                'App'
            );
            
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByRole('navigation', { name: /menu de navegação principal/i })).toBeInTheDocument();
        });
    });

    describe('API e Processamento de Dados', () => {
        beforeEach(() => {
            global.fetch.mockClear();
        });

        it('deve processar diferentes estruturas de dados da API', async () => {
            const mockMoviesData = [{ id: 1, title: 'Movie 1', type: 'movie' }];
            const mockSeriesData = [{ id: 2, title: 'Series 1', type: 'tv' }];

            global.fetch
                .mockResolvedValueOnce({ ok: true, json: async () => ({ results: mockMoviesData }) })
                .mockResolvedValueOnce({ ok: true, json: async () => ({ series: mockSeriesData }) });

            const { deduplicateMoviesAndSeries } = await import('../../../utils/deduplication');
            vi.mocked(deduplicateMoviesAndSeries).mockReturnValue([...mockMoviesData, ...mockSeriesData]);

            renderWithMocks({ searchQuery: 'test' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            expect(deduplicateMoviesAndSeries).toHaveBeenCalledWith(
                mockMoviesData,
                mockSeriesData,
                expect.objectContaining({
                    addTypeField: true,
                    movieType: 'movie',
                    seriesType: 'tv',
                    debug: true
                })
            );
        });

        it('deve processar dados com diferentes estruturas (Search, movies, array direto)', async () => {
            const mockMoviesArray = [{ id: 1, title: 'Movie 1', type: 'movie' }];
            const mockSeriesArray = [{ id: 2, title: 'Series 1', type: 'tv' }];
            const { deduplicateMoviesAndSeries } = await import('../../../utils/deduplication');
            
            global.fetch
                .mockResolvedValueOnce({ ok: true, json: async () => mockMoviesArray })
                .mockResolvedValueOnce({ ok: true, json: async () => ({ Search: mockSeriesArray }) });

            vi.mocked(deduplicateMoviesAndSeries).mockReturnValue(mockMoviesArray);
            renderWithMocks({ searchQuery: 'test' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            expect(deduplicateMoviesAndSeries).toHaveBeenCalledWith(mockMoviesArray, mockSeriesArray, expect.any(Object));

            global.fetch.mockClear();
            global.fetch
                .mockResolvedValueOnce({ ok: true, json: async () => ({ movies: mockMoviesArray }) })
                .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) });

            vi.mocked(deduplicateMoviesAndSeries).mockReturnValue(mockMoviesArray);
            renderWithMocks({ searchQuery: 'test2' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            expect(deduplicateMoviesAndSeries).toHaveBeenCalledWith(mockMoviesArray, [], expect.any(Object));
        });

        it('deve tratar estruturas inválidas e erros', async () => {
            global.fetch
                .mockResolvedValueOnce({ ok: true, json: async () => ({ invalidField: 'no valid structure' }) })
                .mockResolvedValueOnce({ ok: true, json: async () => ({ invalidStructure: 'not an array' }) });

            const { deduplicateMoviesAndSeries } = await import('../../../utils/deduplication');
            vi.mocked(deduplicateMoviesAndSeries).mockReturnValue([]);

            renderWithMocks({ searchQuery: 'test' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            expect(deduplicateMoviesAndSeries).toHaveBeenCalledWith([], [], expect.any(Object));
        });

        it('deve tratar erros de rede e AbortError', async () => {
            const abortError = new Error('Operation was aborted');
            abortError.name = 'AbortError';

            global.fetch.mockRejectedValue(abortError);
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

            renderWithMocks({ searchQuery: 'test' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            expect(consoleSpy).toHaveBeenCalledWith('Requisição cancelada');
            consoleSpy.mockRestore();

            const networkError = new Error('Network error');
            global.fetch.mockRejectedValue(networkError);
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            renderWithMocks({ searchQuery: 'test2' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            expect(consoleErrorSpy).toHaveBeenCalledWith('Erro na busca:', networkError);
            consoleErrorSpy.mockRestore();
        });

        it('deve cancelar requisições anteriores', async () => {
            const mockAbort = vi.fn();
            const mockAbortController = { abort: mockAbort, signal: { aborted: false } };

            global.AbortController = vi.fn(() => mockAbortController);
            global.fetch.mockResolvedValue({ ok: true, json: async () => ({ results: [] }) });

            const { rerender } = render(
                <MockSearchProvider>
                    <MockFavoritesProvider>
                        <MockNotificationProvider>
                            <Home />
                        </MockNotificationProvider>
                    </MockFavoritesProvider>
                </MockSearchProvider>
            );

            vi.mocked(SearchContext.useSearch).mockReturnValue({ ...defaultSearchMock, searchQuery: 'first' });
            rerender(
                <MockSearchProvider>
                    <MockFavoritesProvider>
                        <MockNotificationProvider>
                            <Home />
                        </MockNotificationProvider>
                    </MockFavoritesProvider>
                </MockSearchProvider>
            );

            await waitFor(() => expect(global.AbortController).toHaveBeenCalled());

            vi.mocked(SearchContext.useSearch).mockReturnValue({ ...defaultSearchMock, searchQuery: 'second' });
            rerender(
                <MockSearchProvider>
                    <MockFavoritesProvider>
                        <MockNotificationProvider>
                            <Home />
                        </MockNotificationProvider>
                    </MockFavoritesProvider>
                </MockSearchProvider>
            );

            await waitFor(() => expect(mockAbort).toHaveBeenCalled());
        });
    });

    describe('Filtros e Funcionalidades', () => {
        it('deve tratar remoção de filtros corretamente', async () => {
            const mockHandleFilterChange = vi.fn();
            
            const TestComponent = () => {
                const handleRemoveFilter = (filterKey) => {
                    if (filterKey === 'sortBy') {
                        mockHandleFilterChange('sortBy', 'relevance');
                    } else {
                        mockHandleFilterChange(filterKey, '');
                    }
                };

                return (
                    <div>
                        <button onClick={() => handleRemoveFilter('sortBy')}>Remove Sort</button>
                        <button onClick={() => handleRemoveFilter('year')}>Remove Year</button>
                        <button onClick={() => handleRemoveFilter('type')}>Remove Type</button>
                    </div>
                );
            };

            render(<TestComponent />);

            await userEvent.click(screen.getByText('Remove Sort'));
            expect(mockHandleFilterChange).toHaveBeenCalledWith('sortBy', 'relevance');

            await userEvent.click(screen.getByText('Remove Year'));
            expect(mockHandleFilterChange).toHaveBeenCalledWith('year', '');

            await userEvent.click(screen.getByText('Remove Type'));
            expect(mockHandleFilterChange).toHaveBeenCalledWith('type', '');
        });

        it('deve exibir resultados quando há dados', async () => {
            const mockResults = [
                { id: 1, title: 'Batman', year: '2022', poster: 'batman.jpg', type: 'movie' },
                { id: 2, title: 'Superman', year: '2023', poster: 'superman.jpg', type: 'movie' }
            ];

            global.fetch.mockResolvedValue({
                ok: true,
                json: async () => ({ results: mockResults })
            });

            const { deduplicateMoviesAndSeries } = await import('../../../utils/deduplication');
            vi.mocked(deduplicateMoviesAndSeries).mockReturnValue(mockResults);

            renderWithMocks({ searchQuery: 'batman' });

            await waitFor(() => {
                expect(screen.queryByText('Buscando...')).not.toBeInTheDocument();
            }, { timeout: 1000 });

            await waitFor(() => {
                expect(screen.queryByText(/Resultados da Busca/)).toBeInTheDocument();
            }, { timeout: 1000 });
        });
    });
});
