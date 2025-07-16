package com.luarrezende.backend.clientdto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@NoArgsConstructor  
@AllArgsConstructor
public class SeasonDto {
    @JsonProperty("Title")
    private String title;
    
    @JsonProperty("Season") 
    private String season;
    
    // Para temporadas, este campo pode não existir na resposta da API
    @JsonProperty("totalSeasons")
    private String totalSeasons;
    
    @JsonProperty("Episodes")
    private EpisodeDto[] episodes;
    
    @JsonProperty("Response")
    private String response;
    
    // Campos extras que podem vir na resposta
    @JsonProperty("Error")
    private String error;
}
