# 🎬 Privacy Tools - Aplicação Fullstack

Aplicação completa para busca e descoberta de filmes e séries, integrando com a API OMDb. Desenvolvida com **Spring Boot** (backend) e **React** (frontend).

## 🚀 **INÍCIO RÁPIDO COM DOCKER COMPOSE** (Recomendado)

### 📦 Subir Toda a Aplicação (1 comando)

```bash
# 1. Clone o repositório
git clone <repository-url>
cd privacy-tools

# 2. Configure sua API key da OMDb
export OMDB_API_KEY=sua_api_key_aqui

# 3. Suba tudo com Docker Compose
docker-compose up -d
```

**Pronto! 🎉**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

### 🔧 Comandos Docker Compose

```bash
# Subir aplicação
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar aplicação
docker-compose down

# Reconstruir imagens
docker-compose build --no-cache

# Remover tudo (containers, volumes, redes)
docker-compose down -v --remove-orphans
```

## 📋 Pré-requisitos

### Para Docker (Recomendado)

- **Docker** e **Docker Compose**
- **Conta na OMDb API** (gratuita em [omdbapi.com](http://omdbapi.com/apikey.aspx))

### Para Desenvolvimento Local

- **Java 17+** para o backend
- **Maven 3.6+** para o backend
- **Node.js 18+** para o frontend
- **npm** ou **yarn** para o frontend

## 🏗️ Arquitetura da Aplicação

```
Privacy Tools
├── Backend (Spring Boot)      # API REST - Porta 8080
│   ├── Integração OMDb API
│   ├── Cache com Caffeine
│   ├── Rate Limiting
│   └── Swagger Documentation
│
├── Frontend (React + Vite)    # Interface Web - Porta 3000
│   ├── Busca em Tempo Real
│   ├── Sistema de Favoritos
│   ├── Filtros Avançados
│   └── Design Responsivo
│
└── Docker Compose            # Orquestração
    ├── Container Backend
    ├── Container Frontend
    └── Rede Interna
```

## 🐳 **DOCKER COMPOSE - DETALHADO**

### Configuração Completa

```yaml
# docker-compose.yml
services:
  backend:
    build:
      context: ./backend
    container_name: privacy-tools-backend
    ports:
      - "8080:8080"
    environment:
      - OMDB_API_KEY=${OMDB_API_KEY}
      - SPRING_PROFILES_ACTIVE=dev

  frontend:
    build:
      context: ./frontend
    container_name: privacy-tools-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
OMDB_API_KEY=sua_api_key_aqui
```

### Comandos Avançados

```bash
# Logs específicos
docker-compose logs backend
docker-compose logs frontend

# Executar comandos nos containers
docker-compose exec backend bash
docker-compose exec frontend sh

# Verificar status
docker-compose ps

# Escalar serviços (se necessário)
docker-compose up -d --scale backend=2
```

## 🛠️ Desenvolvimento Local (Sem Docker)

### 1. Backend (Spring Boot)

```bash
cd backend

# Configurar API key
export OMDB_API_KEY=sua_api_key_aqui

# Instalar dependências
mvn clean install

# Executar
mvn spring-boot:run
```

### 2. Frontend (React)

```bash
cd frontend

# Instalar dependências
npm install

# Executar
npm run dev
```

## 🧪 Testes

### Backend

```bash
cd backend

# Executar testes
mvn test

# Cobertura de testes
mvn test jacoco:report
open target/site/jacoco/index.html
```

### Frontend

```bash
cd frontend

# Executar testes
npm run test

# Cobertura de testes
npm run test:coverage
open coverage/index.html
```

## 📊 Funcionalidades

### ✅ Backend (Spring Boot)

- [X]  **API REST** completa para filmes e séries
- [X]  **Integração OMDb API** com fallback
- [X]  **Cache inteligente** (Caffeine - 1 hora)
- [X]  **Rate Limiting** (100 req/min)
- [X]  **Paginação** de resultados
- [X]  **Tratamento de erros** robusto
- [X]  **Documentação Swagger** interativa
- [X]  **Testes unitários** (90%+ cobertura)
- [X]  **CORS configurado** para frontend
- [X]  **Logs estruturados** para monitoramento

### ✅ Frontend (React)

- [X]  **Busca em tempo real** com debouncing
- [X]  **Filtros avançados** (ano, tipo, ordenação)
- [X]  **Sistema de favoritos** persistente
- [X]  **Paginação inteligente** sincronizada
- [X]  **Design responsivo** mobile-first
- [X]  **Loading states** e feedback visual
- [X]  **Navegação fluida** entre páginas
- [X]  **Cancelamento automático** de requisições
- [X]  **Deduplicação** de resultados
- [X]  **Testes abrangentes** (85%+ cobertura)

## 🔗 Endpoints Principais

### 🎬 Filmes

- `GET /api/movies/search?title=Matrix` - Buscar por título
- `GET /api/movies/searchall?title=Matrix&page=1` - Busca paginada
- `GET /api/movies/details?id=tt0133093` - Detalhes por ID

### 📺 Séries

- `GET /api/series/search?title=Breaking Bad` - Buscar por título
- `GET /api/series/searchall?title=Breaking&page=1` - Busca paginada
- `GET /api/series/details?id=tt0903747` - Detalhes por ID
- `GET /api/series/season?seriesId=tt0903747&season=1` - Temporada
- `GET /api/series/episode?seriesId=tt0903747&season=1&episode=3` - Episódio

## 🌐 Acessos Rápidos


| Serviço         | URL                                   | Descrição               |
| ---------------- | ------------------------------------- | ------------------------- |
| **Frontend**     | http://localhost:3000                 | Interface principal       |
| **Backend**      | http://localhost:8080                 | API REST                  |
| **Swagger**      | http://localhost:8080/swagger-ui.html | Documentação interativa |
| **Health Check** | http://localhost:8080/test            | Status do backend         |

## 🔧 Configurações Avançadas

### Personalizar Portas

```yaml
# docker-compose.yml
services:
  backend:
    ports:
      - "8081:8080"  # Backend na porta 8081
  
  frontend:
    ports:
      - "3001:80"    # Frontend na porta 3001
```

### Modo Produção

```bash
# Build otimizado
docker-compose -f docker-compose.prod.yml up -d

# Ou com override
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🐛 Solução de Problemas

### Docker Compose não inicia

```bash
# Verificar se Docker está rodando
docker --version
docker-compose --version

# Limpar cache do Docker
docker system prune -a

# Verificar logs
docker-compose logs
```

### Backend não conecta com OMDb

```bash
# Verificar API key
echo $OMDB_API_KEY

# Testar API key manualmente
curl "http://www.omdbapi.com/?t=Matrix&apikey=$OMDB_API_KEY"
```

### Frontend não carrega

```bash
# Verificar se backend está rodando
curl http://localhost:8080/test

# Verificar logs do frontend
docker-compose logs frontend
```

### Portas já em uso

```bash
# Verificar portas ocupadas
netstat -tuln | grep :8080
netstat -tuln | grep :3000

# Parar processos nas portas
sudo lsof -ti:8080 | xargs kill -9
sudo lsof -ti:3000 | xargs kill -9
```

## 📁 Estrutura do Projeto

```
privacy-tools/
├── backend/                    # Spring Boot API
│   ├── src/main/java/         # Código fonte
│   ├── src/test/java/         # Testes
│   ├── pom.xml                # Dependências Maven
│   ├── Dockerfile             # Imagem Docker
│   └── README.md              # Documentação backend
│
├── frontend/                   # React SPA
│   ├── src/                   # Código fonte
│   ├── public/                # Arquivos estáticos
│   ├── package.json           # Dependências npm
│   ├── Dockerfile             # Imagem Docker
│   └── README.md              # Documentação frontend
│
├── docker-compose.yml         # Orquestração
├── .env                       # Variáveis de ambiente
├── .gitignore                 # Arquivos ignorados
└── README.md                  # Esta documentação
```

## 🚀 Deploy em Produção

### Opção 1: Docker Compose

```bash
# Produção com Docker
docker-compose -f docker-compose.prod.yml up -d
```

### Opção 2: Serviços Separados

```bash
# Backend
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build
# Deploy pasta dist/ para servidor web
```

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend
```

### Métricas

- **Cache hit rate**: Visível nos logs do backend
- **Tempo de resposta**: Monitorado pela aplicação
- **Rate limiting**: Ativo com 100 req/min

## 🔐 Segurança

### ⚠️ Importantes

- **API Key**: Nunca committar no código
- **CORS**: Configurado para localhost (dev)
- **Rate Limiting**: Proteção contra spam
- **Validação**: Inputs validados no backend

### Produção

```bash
# Configurar CORS para domínio real
# backend/src/main/java/config/SecurityConfig.java
setAllowedOrigins(Arrays.asList("https://seudominio.com"));
```

## 📞 Suporte

### Documentação Completa

- **Backend**: `./backend/README.md`
- **Frontend**: `./frontend/README.md`
- **Swagger**: http://localhost:8080/swagger-ui.html
- Me manda mensagem no WhatsApp (Luar)

### Comandos de Diagnóstico

```bash
# Status geral
docker-compose ps

# Logs de erro
docker-compose logs backend | grep ERROR
docker-compose logs frontend | grep error

# Teste de conectividade
curl http://localhost:8080/test
curl http://localhost:3000
```

## 🎯 Próximos Passos

1. **Configurar** sua API key da OMDb
2. **Executar** `docker-compose up -d`
3. **Acessar** http://localhost:3000
4. **Explorar** a documentação Swagger
5. **Testar** as funcionalidades

---

## 🏆 Créditos

**Tecnologias Utilizadas:**

- Backend: Spring Boot, Java 17, Maven, Caffeine, Bucket4j
- Frontend: React 19, Vite, React Router, Vitest
- Infraestrutura: Docker, Docker Compose
- API: OMDb API para dados de filmes e séries

**Desenvolvido com ❤️ para o desafio Privacy Tools**
