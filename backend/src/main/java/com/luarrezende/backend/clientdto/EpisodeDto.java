package com.luarrezende.backend.clientdto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EpisodeDto {
    @JsonProperty("Title")
    private String title;
    
    @JsonProperty("Released")
    private String released;
    
    @JsonProperty("Episode")
    private String episode;
    
    @JsonProperty("imdbRating")
    private String imdbRating;
    
    @JsonProperty("imdbID")
    private String imdbID;
}
