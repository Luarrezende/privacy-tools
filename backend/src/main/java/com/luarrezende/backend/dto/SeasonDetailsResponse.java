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
public class SeasonDetailsResponse {
    
    private String title;
    private String season;
    private String totalSeasons;
    private List<EpisodeSummary> episodes;
    private boolean success;
    private String errorMessage;
    private String response;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EpisodeSummary {
        private String title;
        private String released;
        private String episode;
        private String imdbRating;
        private String imdbID;
    }
}
