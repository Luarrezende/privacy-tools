// API Configuration
export const apiBaseUrlL = "http://localhost:8080/api";

// API Endpoints
export const apiEndpoints = {
    movies: {
        searchAll: "/movies/searchall",
        searchById: "/movies/search",
        details: "/movies/details",
        base: "/movies",
    },
    SERIES: {
        searchAll: "/series/searchall",
        searchById: "/series/search", 
        details: "/series/details",
        seasons: "/series/season",
        episodes: "/series/episode",
        base: "/series",
    },
};

// Request Configuration
export const requestConfig = {
    defaultHeaders: {
        "Content-Type": "application/json",
    },
    TIMEOUT: 10000,
};
