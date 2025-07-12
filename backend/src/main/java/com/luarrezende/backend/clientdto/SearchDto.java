package com.luarrezende.backend.clientdto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchDto {
    @JsonProperty("Title")
    private String Title;

    @JsonProperty("Year")
    private String Year;

    @JsonProperty("imdbID")
    private String imdbID;

    @JsonProperty("Type")
    private String Type;

    @JsonProperty("Poster")
    private String Poster;
}
