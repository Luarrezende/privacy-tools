
# Usa imagem oficial do OpenJDK 17
FROM eclipse-temurin:17-jdk-jammy

# Define diretório de trabalho
WORKDIR /app

# Copia o arquivo JAR gerado pelo Maven (ajuste o nome conforme seu build)
COPY target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta que a aplicação vai rodar
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
