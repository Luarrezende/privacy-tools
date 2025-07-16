package com.luarrezende.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieSearchResponse {
    
    private List<MovieSummary> movies;
    private int totalResults;
    private int currentPage;
    private int totalPages;
    private boolean hasNextPage;
    private boolean hasPreviousPage;
    private String searchTerm;
    private String searchType;
    private boolean success;
    private String errorMessage;
    private long searchTime;
    private int itemsPerPage;
    private List<String> suggestions;
    private SearchFilters appliedFilters;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchFilters {
        private String genre;
        private String year;
        private String type;
        private String minRating;
        private String maxRating;
        private String language;
        private String country;
    }
}
