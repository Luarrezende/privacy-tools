import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SearchProvider, useSearch } from '../../context/SearchContext';

const mockNavigate = vi.fn();
const mockLocation = {
  pathname: '/'
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  };
});

const TestComponent = () => {
  const {
    searchQuery,
    filters,
    isSearchOpen,
    isFiltersOpen,
    pagination,
    shouldShowSearch,
    handleSearch,
    handleFilterChange,
    handlePageChange,
    updatePagination,
    toggleSearch,
    toggleFilters,
    clearSearch,
    clearFilters,
    setIsSearchOpen
  } = useSearch();

  return (
    <div>
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="filters">{JSON.stringify(filters)}</div>
      <div data-testid="is-search-open">{isSearchOpen.toString()}</div>
      <div data-testid="is-filters-open">{isFiltersOpen.toString()}</div>
      <div data-testid="pagination">{JSON.stringify(pagination)}</div>
      <div data-testid="should-show-search">{shouldShowSearch().toString()}</div>
      
      <button onClick={() => handleSearch('test query')}>Search</button>
      <button onClick={() => handleFilterChange('year', '2020')}>Change Year</button>
      <button onClick={() => handleFilterChange('type', 'movie')}>Change Type</button>
      <button onClick={() => handleFilterChange('sortBy', 'year')}>Change Sort</button>
      <button onClick={() => handlePageChange(2)}>Change Page</button>
      <button onClick={() => updatePagination(
        { totalResults: 50, totalPages: 5, hasNextPage: true },
        { totalResults: 30, totalPages: 3, hasNextPage: false }
      )}>Update Pagination</button>
      <button onClick={toggleSearch}>Toggle Search</button>
      <button onClick={toggleFilters}>Toggle Filters</button>
      <button onClick={clearSearch}>Clear Search</button>
      <button onClick={clearFilters}>Clear Filters</button>
      <button onClick={() => setIsSearchOpen(true)}>Set Search Open</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <BrowserRouter>
      <SearchProvider>
        <TestComponent />
      </SearchProvider>
    </BrowserRouter>
  );
};

describe('SearchContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.pathname = '/';
  });

  it('deve lancar erro quando useSearch e usado fora do provider', () => {
    const TestError = () => {
      useSearch();
      return <div>Test</div>;
    };
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestError />)).toThrow('useSearch deve ser usado dentro de SearchProvider');
    consoleSpy.mockRestore();
  });

  it('deve mostrar search apenas na pagina inicial', () => {
    renderWithProvider();
    expect(screen.getByTestId('should-show-search')).toHaveTextContent('true');
  });

  it('deve nao mostrar search em outras paginas', () => {
    mockLocation.pathname = '/movies/123';
    renderWithProvider();
    expect(screen.getByTestId('should-show-search')).toHaveTextContent('false');
  });

  it('deve atualizar query de pesquisa', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Search'));
    expect(screen.getByTestId('search-query')).toHaveTextContent('test query');
  });

  it('deve resetar pagina ao pesquisar', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Change Page'));
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":2');
    
    fireEvent.click(screen.getByText('Search'));
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":1');
  });

  it('deve navegar para home ao pesquisar de outra pagina', () => {
    mockLocation.pathname = '/movies/123';
    renderWithProvider();
    fireEvent.click(screen.getByText('Search'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve atualizar filtros', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Change Year'));
    expect(screen.getByTestId('filters')).toHaveTextContent('"year":"2020"');
    
    fireEvent.click(screen.getByText('Change Type'));
    expect(screen.getByTestId('filters')).toHaveTextContent('"type":"movie"');
    
    fireEvent.click(screen.getByText('Change Sort'));
    expect(screen.getByTestId('filters')).toHaveTextContent('"sortBy":"year"');
  });

  it('deve resetar pagina ao mudar filtros', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Change Page'));
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":2');
    
    fireEvent.click(screen.getByText('Change Year'));
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":1');
  });

  it('deve navegar para home ao mudar filtros de outra pagina', () => {
    mockLocation.pathname = '/series/456';
    renderWithProvider();
    fireEvent.click(screen.getByText('Change Year'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve atualizar paginacao', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Change Page'));
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":2');
  });

  it('deve calcular paginacao combinada', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Update Pagination'));
    
    const pagination = screen.getByTestId('pagination');
    expect(pagination).toHaveTextContent('"totalResults":80');
    expect(pagination).toHaveTextContent('"totalPages":5');
    expect(pagination).toHaveTextContent('"hasNextPage":true');
  });

  it('deve alternar busca', () => {
    renderWithProvider();
    expect(screen.getByTestId('is-search-open')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Toggle Search'));
    expect(screen.getByTestId('is-search-open')).toHaveTextContent('true');
  });

  it('deve navegar para home ao abrir busca de outra pagina', () => {
    mockLocation.pathname = '/favorites';
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle Search'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve alternar filtros', () => {
    renderWithProvider();
    expect(screen.getByTestId('is-filters-open')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Toggle Filters'));
    expect(screen.getByTestId('is-filters-open')).toHaveTextContent('true');
  });

  it('deve limpar pesquisa e filtros', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Search'));
    fireEvent.click(screen.getByText('Change Year'));
    fireEvent.click(screen.getByText('Change Page'));
    
    fireEvent.click(screen.getByText('Clear Search'));
    
    expect(screen.getByTestId('search-query')).toHaveTextContent('');
    expect(screen.getByTestId('filters')).toHaveTextContent('"year":""');
    expect(screen.getByTestId('filters')).toHaveTextContent('"type":""');
    expect(screen.getByTestId('filters')).toHaveTextContent('"sortBy":"relevance"');
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":1');
    expect(screen.getByTestId('pagination')).toHaveTextContent('"totalResults":0');
  });

  it('deve limpar apenas filtros', () => {
    renderWithProvider();
    fireEvent.click(screen.getByText('Search'));
    fireEvent.click(screen.getByText('Change Year'));
    fireEvent.click(screen.getByText('Change Page'));
    
    fireEvent.click(screen.getByText('Clear Filters'));
    
    expect(screen.getByTestId('search-query')).toHaveTextContent('test query');
    expect(screen.getByTestId('filters')).toHaveTextContent('"year":""');
    expect(screen.getByTestId('filters')).toHaveTextContent('"type":""');
    expect(screen.getByTestId('filters')).toHaveTextContent('"sortBy":"relevance"');
    expect(screen.getByTestId('pagination')).toHaveTextContent('"currentPage":1');
  });

  it('deve definir estado da busca', () => {
    renderWithProvider();
    expect(screen.getByTestId('is-search-open')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Set Search Open'));
    expect(screen.getByTestId('is-search-open')).toHaveTextContent('true');
  });

  it('deve focar no input ao abrir busca', async () => {
    const mockFocus = vi.fn();
    const mockGetElementById = vi.spyOn(document, 'getElementById').mockReturnValue({
      focus: mockFocus
    });
    
    renderWithProvider();
    fireEvent.click(screen.getByText('Toggle Search'));
    
    await waitFor(() => {
      expect(mockFocus).toHaveBeenCalled();
    });
    
    mockGetElementById.mockRestore();
  });
});
