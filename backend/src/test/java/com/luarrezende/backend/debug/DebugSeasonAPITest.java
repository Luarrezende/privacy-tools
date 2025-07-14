package com.luarrezende.backend.debug;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;
import com.luarrezende.backend.clientdto.SeasonDto;

class DebugSeasonAPITest {

    @Test
    void debugOMDBSeasonResponse() {
        RestTemplate restTemplate = new RestTemplate();
        
        // URL para Breaking Bad Season 1 - usando a chave da aplicação
        String url = "http://www.omdbapi.com/?i=tt0903747&Season=1&apikey=6cbea79b";
        
        try {
            // Primeiro, vamos ver a resposta raw como String
            String rawResponse = restTemplate.getForObject(url, String.class);
            System.out.println("=== RAW RESPONSE ===");
            System.out.println(rawResponse);
            
            // Agora tentar mapear para nosso DTO
            SeasonDto seasonDto = restTemplate.getForObject(url, SeasonDto.class);
            System.out.println("=== MAPPED DTO ===");
            System.out.println("Title: " + seasonDto.getTitle());
            System.out.println("Season: " + seasonDto.getSeason());
            System.out.println("TotalSeasons: " + seasonDto.getTotalSeasons());
            System.out.println("Episodes length: " + (seasonDto.getEpisodes() != null ? seasonDto.getEpisodes().length : "null"));
            System.out.println("Response: " + seasonDto.getResponse());
            
            if (seasonDto.getEpisodes() != null && seasonDto.getEpisodes().length > 0) {
                System.out.println("=== FIRST EPISODE ===");
                System.out.println("Episode Title: " + seasonDto.getEpisodes()[0].getTitle());
                System.out.println("Episode Number: " + seasonDto.getEpisodes()[0].getEpisode());
                System.out.println("Released: " + seasonDto.getEpisodes()[0].getReleased());
                System.out.println("IMDB Rating: " + seasonDto.getEpisodes()[0].getImdbRating());
            }
            
        } catch (Exception e) {
            System.out.println("Erro: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
