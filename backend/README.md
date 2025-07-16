# 🎬 Privacy Tools - Backend API

API RESTful para busca de filmes e séries usando a OMDb API, desenvolvida com Spring Boot e Java 17.

## 📋 Pré-requisitos

- **Java 17** ou superior
- **Maven 3.6+**
- **Conta na OMDb API** (gratuita em [omdbapi.com](http://omdbapi.com/apikey.aspx))

## 🚀 Como Executar

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd privacy-tools/backend
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto backend ou configure as variáveis de ambiente:

```bash
# .env
OMDB_API_KEY=sua_api_key_aqui
```

**Ou configure via sistema:**

```bash
# Linux/Mac
export OMDB_API_KEY=sua_api_key_aqui

# Windows
set OMDB_API_KEY=sua_api_key_aqui
```

### 3. Instalar Dependências

```bash
mvn clean install
```

### 4. Executar a Aplicação

```bash
# Opção 1: Via Maven
mvn spring-boot:run

# Opção 2: Via JAR
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Opção 3: Com profile específico
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### 5. Verificar se está Funcionando

```bash
# Teste básico
curl http://localhost:8080/test

# Teste de filme
curl "http://localhost:8080/api/movies/search?title=Matrix"
```

## 📊 Executar Testes

```bash
# Todos os testes
mvn test

# Testes com relatório de cobertura
mvn clean test jacoco:report

# Visualizar cobertura
open target/site/jacoco/index.html
```

## 🐳 Docker

### Construir Imagem

```bash
docker build -t privacy-tools-backend .
```

### Executar Container

```bash
docker run -p 8080:8080 -e OMDB_API_KEY=sua_api_key_aqui privacy-tools-backend
```

### Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d
```

## 🔧 Configuração

### Arquivo `application.properties`

```properties
# Porta do servidor
server.port=8080

# API Key da OMDb (use variável de ambiente em produção)
omdb.api.key=${OMDB_API_KEY:sua_api_key_aqui}

# Cache
spring.cache.type=caffeine

# Logging
logging.level.com.luarrezende.backend=DEBUG
```

### Profiles Disponíveis

- `dev` - Desenvolvimento (mais logs)
- `prod` - Produção (logs otimizados)
- `test` - Testes (cache desabilitado)

## 📖 Documentação da API

### Swagger UI

Acesse: `http://localhost:8080/swagger-ui.html`

### Endpoints Principais

#### 🎥 Filmes

- `GET /api/movies/search?title=Matrix` - Buscar filme por título
- `GET /api/movies/searchall?title=Matrix&page=1` - Buscar todos os filmes (paginado)
- `GET /api/movies/details?id=tt0133093` - Detalhes por ID

#### 📺 Séries

- `GET /api/series/search?title=Breaking Bad` - Buscar série por título
- `GET /api/series/searchall?title=Breaking&page=1` - Buscar todas as séries (paginado)
- `GET /api/series/details?id=tt0903747` - Detalhes por ID
- `GET /api/series/season?seriesId=tt0903747&season=1` - Detalhes da temporada
- `GET /api/series/episode?seriesId=tt0903747&season=1&episode=3` - Detalhes do episódio

### Teste Rápido dos Endpoints

```bash
# Execute o script de teste
chmod +x quick_test.sh
./quick_test.sh

# Ou no PowerShell
./quick_test.ps1
```

## 🔍 Estrutura do Projeto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/luarrezende/backend/
│   │   │   ├── controller/          # Controllers REST
│   │   │   ├── service/             # Lógica de negócio
│   │   │   ├── dto/                 # DTOs de resposta
│   │   │   ├── clientdto/           # DTOs da OMDb API
│   │   │   ├── mapper/              # Conversores DTO
│   │   │   ├── config/              # Configurações
│   │   │   └── BackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Testes unitários
├── target/                          # Arquivos compilados
├── pom.xml                         # Dependências Maven
├── Dockerfile                      # Imagem Docker
└── README.md                       # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

- **Spring Boot 3.5.3** - Framework principal
- **Java 17** - Linguagem de programação
- **Maven** - Gerenciador de dependências
- **Caffeine Cache** - Cache em memória
- **Bucket4j** - Rate limiting
- **Swagger/OpenAPI** - Documentação da API
- **JUnit 5 + Mockito** - Testes unitários
- **Jacoco** - Cobertura de testes
- **Lombok** - Redução de boilerplate

## 🚦 Funcionalidades

### ✅ Implementadas

- [X]  Integração com OMDb API
- [X]  Busca de filmes e séries
- [X]  Paginação de resultados
- [X]  Cache inteligente (1 hora)
- [X]  Rate limiting (100 req/min)
- [X]  Tratamento de erros robusto
- [X]  Documentação Swagger
- [X]  Testes unitários (90%+ cobertura)
- [X]  CORS configurado
- [X]  Detalhes de temporadas e episódios
- [X]  Logs estruturados

### 🔄 Cache

- **Filmes por título**: 1 hora
- **Filmes por ID**: 1 hora
- **Busca paginada**: 1 hora
- **Temporadas**: 1 hora
- **Episódios**: 1 hora

### 🛡️ Rate Limiting

- **Limite**: 100 requisições por minuto
- **Resposta**: HTTP 429 quando excedido

## 🐛 Solução de Problemas

### Erro: "API key inválida"

```bash
# Verifique se a API key está configurada
echo $OMDB_API_KEY

# Ou teste manualmente
curl "http://www.omdbapi.com/?t=Matrix&apikey=SUA_API_KEY"
```

### Erro: "Port 8080 already in use"

```bash
# Mude a porta no application.properties
server.port=8081

# Ou via parâmetro
mvn spring-boot:run -Dserver.port=8081
```

### Erro: "Java version"

```bash
# Verifique a versão do Java
java -version

# Deve ser 17 ou superior
```

### Erro: "Maven not found"

```bash
# Instale o Maven
# Ubuntu/Debian
sudo apt install maven

# MacOS
brew install maven

# Windows
# Baixe de: https://maven.apache.org/download.cgi
```

## 📊 Monitoramento

### Logs

```bash
# Logs em tempo real
tail -f logs/application.log

# Logs de cache
grep "CACHE" logs/application.log
```

### Métricas

- Cache hit rate visível nos logs
- Tempo de resposta das APIs
- Rate limiting ativo

## 🔐 Segurança

### ⚠️ Importante

- **NUNCA** commite a API key no código
- Use variáveis de ambiente em produção
- Configure HTTPS em produção
- Monitore o rate limiting

### CORS

- Configurado para `http://localhost:3000` (frontend)
- Modifique em `SecurityConfig.java` para outros domínios

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs em `logs/application.log`
2. Execute os testes: `mvn test`
3. Consulte o Swagger UI
4. Verifique as issues no repositório
5. Me manda mensagem no WhatsApp (Luar)

## 🎯 IDs de Teste

Para testar a API, use estes IDs válidos:

**Filmes:**

- Matrix: `tt0133093`
- Inception: `tt1375666`
- Interstellar: `tt0816692`

**Séries:**

- Breaking Bad: `tt0903747`
- Game of Thrones: `tt0944947`
- The Office: `tt0386676`

---

**Desenvolvido com ❤️ usando Spring Boot**
