package com.luarrezende.backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import java.nio.file.Paths;

public class EnvUtil {
    private static final Dotenv dotenv = Dotenv.configure()
        .directory(Paths.get("").toAbsolutePath().getParent().toString())
        .ignoreIfMalformed()
        .ignoreIfMissing()
        .load();

    public static String get(String key) {
        return dotenv.get(key);
    }
}
