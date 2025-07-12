package com.luarrezende.backend.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RatingsDto {
    @JsonProperty("Source")
    private String source;
    
    @JsonProperty("Value")
    private String value;
}
