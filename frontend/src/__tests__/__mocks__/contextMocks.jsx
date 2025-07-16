import React from 'react';
import { vi } from 'vitest';

// Mock contexts
const SearchContext = React.createContext();
const FavoritesContext = React.createContext();
const NotificationContext = React.createContext();

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
    clearFilters: vi.fn(),
    performSearch: vi.fn(),
};

export const mockFavoritesContext = {
    favorites: [],
    addToFavorites: vi.fn(),
    removeFromFavorites: vi.fn(),
    isFavorite: vi.fn().mockReturnValue(false),
    clearFavorites: vi.fn(),
    getFavoritesStats: vi.fn().mockReturnValue({ total: 0, movies: 0, series: 0 }),
};

export const mockNotificationContext = {
    notifications: [],
    addNotification: vi.fn(),
    removeNotification: vi.fn(),
    clearNotifications: vi.fn(),
};

export const MockSearchProvider = ({ children, value = mockSearchContext }) => {
    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export const MockFavoritesProvider = ({ children, value = mockFavoritesContext }) => {
    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const MockNotificationProvider = ({ children, value = mockNotificationContext }) => {
    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
