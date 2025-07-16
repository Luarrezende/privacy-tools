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
public class EpisodeDetailsResponse {
    
    private String id;
    private String title;
    private String year;
    private String genre;
    private String director;
    private String plot;
    private String rated;
    private String runtime;
    private String language;
    private String country;
    private String actors;
    private String writer;
    private String imdbRating;
    private String imdbVotes;
    private String metascore;
    private List<Rating> ratings;
    private String poster;
    private String awards;
    private String released;
    private String dvd;
    private String boxOffice;
    private String type;
    private String season;
    private String episode;
    private String seriesID;
    private boolean success;
    private String errorMessage;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Rating {
        private String source;
        private String value;
    }
}
