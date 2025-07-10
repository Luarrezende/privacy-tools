package com.luarrezende.backend.controller;

import com.luarrezende.backend.config.EnvUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String testEnv() {
        return "OMDB_API_KEY: " + EnvUtil.get("OMDB_API_KEY");
    }
}
