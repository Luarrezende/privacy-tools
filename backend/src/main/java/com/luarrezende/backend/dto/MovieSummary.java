package com.luarrezende.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieSummary {
    
    private String id;
    private String title;
    private String year;
    private String type;
    private String genre;
    private String director;
    private String poster;
    private String imdbRating;
    private String plotSummary;
    private String totalSeasons;
    private String released;
    private String runtime;
    private boolean available;
}
