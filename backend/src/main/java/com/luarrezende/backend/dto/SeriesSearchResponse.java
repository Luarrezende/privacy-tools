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
public class SeriesSearchResponse {
    private List<SeriesSummary> series;
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
}
