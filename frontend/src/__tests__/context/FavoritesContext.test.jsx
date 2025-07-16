import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { FavoritesProvider, useFavorites } from '../../context/FavoritesContext';

vi.mock('../../utils/contentTypes', () => ({
  isMovieType: (type) => type === 'movie',
  isTVType: (type) => type === 'series'
}));

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const TestComponent = () => {
  const {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
    getFavoritesStats
  } = useFavorites();

  return (
    <div>
      <div data-testid="favorites-count">{favorites.length}</div>
      <div data-testid="favorites-list">{JSON.stringify(favorites)}</div>
      <div data-testid="is-favorite">{isFavorite('123').toString()}</div>
      <div data-testid="stats">{JSON.stringify(getFavoritesStats())}</div>
      
      <button onClick={() => addToFavorites({ id: '123', title: 'Test Movie', type: 'movie' })}>
        Add Movie
      </button>
      <button onClick={() => addToFavorites({ id: '456', title: 'Test Series', type: 'series' })}>
        Add Series
      </button>
      <button onClick={() => removeFromFavorites('123')}>Remove Movie</button>
      <button onClick={() => toggleFavorite({ id: '789', title: 'Toggle Movie', type: 'movie' })}>
        Toggle Favorite
      </button>
      <button onClick={clearFavorites}>Clear All</button>
    </div>
  );
};

const renderWithProvider = () => {
  return render(
    <FavoritesProvider>
      <TestComponent />
    </FavoritesProvider>
  );
};

describe('FavoritesContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    vi.spyOn(window, 'dispatchEvent').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve lancar erro quando useFavorites e usado fora do provider', () => {
    const TestError = () => {
      useFavorites();
      return <div>Test</div>;
    };
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestError />)).toThrow('useFavorites deve ser usado dentro de FavoritesProvider');
    consoleSpy.mockRestore();
  });

  it('deve carregar favoritos do localStorage', () => {
    const savedFavorites = [{ id: '123', title: 'Saved Movie', type: 'movie' }];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedFavorites));
    
    renderWithProvider();
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('Saved Movie');
  });

  it('deve tratar erro ao carregar favoritos do localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid-json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithProvider();
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
    expect(consoleSpy).toHaveBeenCalledWith('Erro ao carregar favoritos:', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('deve salvar favoritos no localStorage', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'privacy-tools-favorites',
      expect.stringContaining('Test Movie')
    );
  });

  it('deve adicionar filme aos favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('Test Movie');
  });

  it('deve adicionar serie aos favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Series'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('Test Series');
  });

  it('deve evitar duplicatas ao adicionar favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    fireEvent.click(screen.getByText('Add Movie'));
    
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
  });

  it('deve disparar notificacao ao adicionar favorito', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'showNotification',
        detail: expect.objectContaining({
          message: 'Test Movie foi adicionado aos favoritos! ❤️',
          type: 'success'
        })
      })
    );
  });

  it('deve remover filme dos favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByText('Remove Movie'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('deve disparar notificacao ao remover favorito', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    fireEvent.click(screen.getByText('Remove Movie'));
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'showNotification',
        detail: expect.objectContaining({
          message: 'Test Movie foi removido dos favoritos',
          type: 'info'
        })
      })
    );
  });

  it('deve verificar se item e favorito', () => {
    renderWithProvider();
    
    expect(screen.getByTestId('is-favorite')).toHaveTextContent('false');
    
    fireEvent.click(screen.getByText('Add Movie'));
    expect(screen.getByTestId('is-favorite')).toHaveTextContent('true');
  });

  it('deve alternar favorito', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Toggle Favorite'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('1');
    
    fireEvent.click(screen.getByText('Toggle Favorite'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('deve limpar todos os favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    fireEvent.click(screen.getByText('Add Series'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('2');
    
    fireEvent.click(screen.getByText('Clear All'));
    expect(screen.getByTestId('favorites-count')).toHaveTextContent('0');
  });

  it('deve disparar notificacao ao limpar favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    fireEvent.click(screen.getByText('Clear All'));
    
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'showNotification',
        detail: expect.objectContaining({
          message: '1 favorito foi removido',
          type: 'warning'
        })
      })
    );
  });

  it('deve calcular estatisticas dos favoritos', () => {
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    fireEvent.click(screen.getByText('Add Series'));
    
    const stats = screen.getByTestId('stats');
    expect(stats).toHaveTextContent('"total":2');
    expect(stats).toHaveTextContent('"movies":1');
    expect(stats).toHaveTextContent('"series":1');
  });

  it('deve adicionar timestamp ao favorito', () => {
    const mockDate = new Date('2023-01-01T00:00:00.000Z');
    vi.spyOn(Date.prototype, 'toISOString').mockReturnValue(mockDate.toISOString());
    
    renderWithProvider();
    
    fireEvent.click(screen.getByText('Add Movie'));
    
    expect(screen.getByTestId('favorites-list')).toHaveTextContent('2023-01-01T00:00:00.000Z');
  });
});
