package com.luarrezende.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SearchAllDto {
    @JsonProperty("Search")
    private SearchDto[] Search;

    @JsonProperty("totalResults")
    private String totalResults;

    @JsonProperty("Response")
    private String Response;

    public boolean isResponse() {
        return "True".equalsIgnoreCase(Response);
    }
}
