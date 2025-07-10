# 📘 DECISIONS.md

Este documento registra as principais decisões técnicas tomadas durante o desenvolvimento do desafio técnico da Privacy Tools.

---

## 🔧 Linguagens e Frameworks

### Backend

- **Linguagem:** Java 17
- **Framework:** Spring Boot
- **Motivo:** Robustez, familiaridade, fácil integração com Spring Data e suporte nativo a boas práticas como injeção de dependência, cache e validação.

### Frontend

- **Linguagem:** JavaScript
- **Framework:** React
- **Motivo:** Popularidade, velocidade de desenvolvimento, facilidade de integração com bibliotecas de UI como Ant Design e Material UI.

---

## 🔗 Integração com OMDb

- Criado um **cliente HTTP dedicado** usando `RestTemplate` para consumir a API pública da OMDb.
- Utilizado DTOs para desacoplar a estrutura da OMDb da estrutura interna da aplicação.
- Todas as chamadas externas são encapsuladas em uma única classe, com fallback planejado para testes locais.

---

## 🚀 API Interna (Gateway)

- Criado um endpoint intermediário que consome a OMDb e fornece os dados já tratados ao frontend.
- Padrões de resposta uniformes para facilitar o consumo no frontend.
- Expostos endpoints RESTful:
  - `/movies/search`
  - `/movies/{imdbId}`

---

## 📦 Cache

- Implementado com `@Cacheable` do Spring para evitar chamadas duplicadas à OMDb.
- Escopo de cache baseado em parâmetros da busca (ex: título, página).
- Justificativa: limite de 1000 requisições por dia na OMDb gratuita.

---

## ⏱️ Rate Limiting

- Usado `Bucket4j` para limitar requisições por IP/rota.
- Justificativa: evitar abusos e preservar as chamadas da OMDb para usuários reais.

---

## 📚 Documentação e Logs

- API documentada automaticamente via **OpenAPI** (`springdoc-openapi-ui`).
- Logs estruturados em JSON com `logback-spring.xml`, visando futura integração com observabilidade (Elastic Stack, por exemplo).

---

## ⚛️ UI/UX

- Utilizado **Ant Design** como base visual, com algumas customizações para melhorar responsividade.
- Componentes reutilizáveis criados para:
  - Cartões de filmes
  - Filtros de busca
  - Tela de detalhes
- Opções de acessibilidade consideradas (ex: feedback de carregamento, mensagens de erro claras).

---

## 📦 Dockerização

- Criado `Dockerfile` para backend e frontend separadamente.
- `docker-compose.yml` orquestra os dois serviços.
- Justificativa: facilitar testes, entrega e integração com pipelines CI/CD.

---

## 🧪 Testes

- Backend testado com JUnit e Mockito, com mocks simulando respostas da OMDb.
- Frontend com cobertura opcional via React Testing Library.
- Justificativa: foco principal no backend e integração, testes garantem confiabilidade mínima das funções críticas.

---

## 🔄 Trade-offs e Oportunidades Futuras

- **Não utilizado Redis para cache**, por simplicidade e tempo, mas seria recomendado para ambientes escaláveis.
- **Não adicionado banco de dados relacional**, pois o escopo do desafio não exigia persistência de favoritos ou usuários.
- **Design mobile-first** não foi implementado, mas o layout é responsivo.

---

🧠 Desenvolvido por **Luar Rezende**
