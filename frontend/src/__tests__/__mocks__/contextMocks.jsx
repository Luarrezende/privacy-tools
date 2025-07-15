import { vi } from 'vitest';

export const mockSearchContext = {
    searchQuery: '',
    setSearchQuery: vi.fn(),
    searchResults: [],
    setSearchResults: vi.fn(),
    isLoading: false,
    setIsLoading: vi.fn(),
    searchType: 'movie',
    setSearchType: vi.fn(),
    currentPage: 1,
    setCurrentPage: vi.fn(),
    totalPages: 1,
    setTotalPages: vi.fn(),
    clearSearch: vi.fn(),
    performSearch: vi.fn(),
};

export const mockFavoritesContext = {
    favorites: [],
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isFavorite: vi.fn().mockReturnValue(false),
    clearFavorites: vi.fn(),
    favoritesCount: 0,
};

export const mockNotificationContext = {
    notifications: [],
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearNotifications: vi.fn(),
};

export const MockSearchProvider = ({ children, value = mockSearchContext }) => {
    return (
        <div data-testid="mock-search-provider">
            {children}
        </div>
    );
};

export const MockFavoritesProvider = ({ children, value = mockFavoritesContext }) => {
    return (
        <div data-testid="mock-favorites-provider">
            {children}
        </div>
    );
};

export const MockNotificationProvider = ({ children, value = mockNotificationContext }) => {
    return (
        <div data-testid="mock-notification-provider">
            {children}
        </div>
    );
};
