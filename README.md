# privacy-tools

# 🎯 Desafio Técnico – Privacy Tools

Este documento apresenta o checklist completo do desenvolvimento da aplicação fullstack para o desafio técnico, abordando os critérios propostos pela Privacy Tools, o planejamento de execução e as decisões aplicadas em cada etapa.

---

## ✅ Requisitos Técnicos e Funcionais

### 🧩 Backend (Java + Spring Boot)

- [X]  Integração com a API pública da OMDb
- [X]  Endpoint para busca por título com filtros de tipo e ano
- [X]  Endpoint para detalhes por IMDb ID
- [X]  Suporte a `plot=short` e `plot=full`
- [X]  Paginação de resultados da busca
- [X]  Padronização das respostas da API interna
- [X]  Cache de respostas para otimizar performance e reduzir chamadas à OMDb
- [X]  Implementação de **rate limiting** para evitar estouro de quota (1000 req/dia)
- [X]  Tratamento estruturado de erros
- [X]  Documentação via OpenAPI (Swagger)
- [X]  Logs estruturados no formato JSON

---

### 🌐 Frontend (React + JavaScript)

- [X]  Tela de busca com filtros (título, ano, tipo)
- [X]  Listagem paginada de resultados com poster, título e ano
- [X]  Tela de detalhes com informações completas
- [X]  Feedback visual para carregamento e falhas
- [X]  Experiência do usuário fluida e agradável
- [X]  (Opcional) Tema claro/escuro e favoritos

---

### 🧪 Testes

- [X]  Testes unitários do backend com JUnit e Mockito
- [X]  (Opcional) Testes no frontend com React Testing Library ou Cypress
- [X]  Mocks simulando respostas da OMDb para testes offline

---

### 🐳 Dockerização

- [X]  `Dockerfile` para o backend (Spring Boot)
- [X]  `Dockerfile` para o frontend (React)
- [X]  `docker-compose.yml` para subir tudo integrado

---

### 📚 Documentação

- [X]  Este `README.md` com instruções e escopo
- [X]  `DECISIONS.md` com todas as decisões arquiteturais e técnicas

---

## 🗂️ Estrutura do Projeto
