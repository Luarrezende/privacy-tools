// API Configuration
export const apiBaseUrlL = "http://localhost:8080/api";

// API Endpoints
export const apiEndpoints = {
    MOVIES: {
        SEARCH_ALL: "/movies/searchall",
        SEARCH_BY_ID: "/movies/search",
        BASE: "/movies",
    },
    SERIES: {
        SEARCH_ALL: "/series/searchall",
        SEARCH_BY_ID: "/series/search",
        SEASONS: "/series/seasons",
        EPISODES: "/series/episodes",
        BASE: "/series",
    },
};

// Request Configuration
export const requestConfig = {
    DEFAULT_HEADERS: {
        "Content-Type": "application/json",
    },
    TIMEOUT: 10000,
};
