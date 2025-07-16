package com.luarrezende.backend.dto;

import lombok.Data;

@Data
public class ErrorResponse {
    private String message;
    private int errorCode;

    public ErrorResponse(String message, int errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }
}
