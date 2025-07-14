package com.luarrezende.backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeriesSummary {
    private String id;
    private String title;
    private String year;
    private String type;
    private String poster;
    private boolean available;
}
