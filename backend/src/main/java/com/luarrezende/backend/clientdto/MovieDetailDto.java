package com.luarrezende.backend.clientdto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MovieDetailDto {
    @JsonProperty("Title")
    private String title;
    
    @JsonProperty("Year")
    private String year;
    
    @JsonProperty("Rated")
    private String rated;
    
    @JsonProperty("Released")
    private String released;
    
    @JsonProperty("Runtime")
    private String runtime;
    
    @JsonProperty("Genre")
    private String genre;
    
    @JsonProperty("Director")
    private String director;
    
    @JsonProperty("Writer")
    private String writer;
    
    @JsonProperty("Actors")
    private String actors;
    
    @JsonProperty("Plot")
    private String plot;
    
    @JsonProperty("Language")
    private String language;
    
    @JsonProperty("Country")
    private String country;
    
    @JsonProperty("Awards")
    private String awards;
    
    @JsonProperty("Poster")
    private String poster;
    
    @JsonProperty("Ratings")
    private RatingsDto[] ratings;
    
    @JsonProperty("Metascore")
    private String metascore;
    
    @JsonProperty("imdbRating")
    private String imdbRating;
    
    @JsonProperty("imdbVotes")
    private String imdbVotes;
    
    @JsonProperty("imdbID")
    private String imdbID;
    
    @JsonProperty("Type")
    private String type;
    
    @JsonProperty("DVD")
    private String dvd;
    
    @JsonProperty("BoxOffice")
    private String boxOffice;
    
    @JsonProperty("Production")
    private String production;
    
    @JsonProperty("Website")
    private String website;
    
    @JsonProperty("totalSeasons")
    private String totalSeasons;
    
    @JsonProperty("Response")
    private String response;
}
