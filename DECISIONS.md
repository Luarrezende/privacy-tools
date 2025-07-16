# 📘 DECISIONS.md

Este documento registra as principais decisões técnicas tomadas durante o desenvolvimento do desafio técnico da Privacy Tools.

---

## 🏗️ **ARQUITETURA GERAL**

### Decisão: Arquitetura Fullstack Separada

**Escolha**: Backend (Spring Boot) + Frontend (React) + Docker Compose
**Motivo**:

- Separação clara de responsabilidades
- Escalabilidade independente dos serviços
- Facilidade de manutenção e desenvolvimento paralelo
- Possibilidade de deploy independente

---

## 🔧 **BACKEND - SPRING BOOT**

### Java 17

**Escolha**: Java 17 LTS
**Motivo**:

- Versão LTS mais recente e estável
- Melhor performance comparado a versões anteriores
- Suporte a records, pattern matching, e outras features modernas
- Compatibilidade com Spring Boot 3.x

### Spring Boot 3.5.3

**Escolha**: Spring Boot 3.5.3
**Motivo**:

- Framework maduro e robusto para APIs REST
- Injeção de dependências nativa
- Configuração por convenção
- Ecossistema rico com starters
- Suporte nativo a cache, security, e web

### Maven

**Escolha**: Maven como gerenciador de dependências
**Motivo**:

- Padrão da indústria para projetos Java
- Integração perfeita com Spring Boot
- Plugins robustos (Jacoco, Spring Boot Maven Plugin)
- Suporte a profiles para diferentes ambientes

### Caffeine Cache

**Escolha**: Caffeine para cache em memória
**Motivo**:

- Performance superior ao EhCache
- Integração nativa com Spring Boot
- Configuração simples via `@Cacheable`
- Evicção automática baseada em tempo (1 hora)
- Estatísticas de cache built-in

### Bucket4j (Rate Limiting)

**Escolha**: Bucket4j para controle de taxa
**Motivo**:

- Implementação eficiente do algoritmo Token Bucket
- Controle preciso de 100 requisições por minuto
- Proteção contra spam e abuso da API
- Integração simples com Spring Boot

### RestTemplate

**Escolha**: RestTemplate para chamadas HTTP
**Motivo**:

- Cliente HTTP maduro e estável
- Integração nativa com Spring Boot
- Tratamento robusto de erros
- Configuração simples para timeouts e interceptors

### Lombok

**Escolha**: Lombok para redução de boilerplate
**Motivo**:

- Redução significativa de código repetitivo
- Getters, setters, e construtores automáticos
- `@Builder` para padrão Builder
- Melhor legibilidade do código

### Swagger/OpenAPI

**Escolha**: SpringDoc OpenAPI para documentação
**Motivo**:

- Documentação automática dos endpoints
- Interface interativa para testes
- Padrão OpenAPI 3.0
- Integração perfeita com Spring Boot

### JUnit 5 + Mockito

**Escolha**: JUnit 5 com Mockito para testes
**Motivo**:

- Framework de testes moderno e completo
- Mockito para mocking de dependências
- Anotações declarativas (`@Test`, `@Mock`)
- Cobertura de testes > 90%

### Jacoco

**Escolha**: Jacoco para cobertura de testes
**Motivo**:

- Análise detalhada de cobertura
- Relatórios HTML visuais
- Integração com Maven
- Métricas de qualidade

---

## 🎨 **FRONTEND - REACT**

### React 19.1.0

**Escolha**: React 19 (versão mais recente)
**Motivo**:

- Framework mais popular para SPAs
- Hooks modernos e performance otimizada
- Ecossistema rico de bibliotecas
- Concurrent features para melhor UX

### Vite 7.0.4

**Escolha**: Vite como build tool
**Motivo**:

- Hot Module Replacement (HMR) extremamente rápido
- Build otimizado para produção
- Configuração mínima necessária
- Suporte nativo a ES modules

### React Router DOM 7.6.3

**Escolha**: React Router para navegação
**Motivo**:

- Padrão para SPAs em React
- Navegação declarativa
- Lazy loading de rotas
- Histórico de navegação

### Context API (Nativo)

**Escolha**: Context API ao invés de Redux
**Motivo**:

- Nativo do React, sem dependências externas
- Suficiente para o escopo da aplicação
- Menor curva de aprendizado
- Performance adequada para o caso de uso

### CSS Modules

**Escolha**: CSS Modules para estilização
**Motivo**:

- Isolamento de estilos por componente
- Evita conflitos de CSS
- Manutenção mais fácil
- Suporte nativo no Vite

### Font Awesome

**Escolha**: Font Awesome para ícones
**Motivo**:

- Biblioteca de ícones mais completa
- Consistência visual
- Facilidade de uso
- Ampla variedade de ícones

---

## 🧪 **TESTES**

### Vitest 2.0.5

**Escolha**: Vitest ao invés de Jest
**Motivo**:

- Integração perfeita com Vite
- Performance superior ao Jest
- Compatibilidade com Jest API
- HMR para testes

### React Testing Library

**Escolha**: RTL para testes de componentes
**Motivo**:

- Filosofia de testar como usuário usa
- Foco em acessibilidade e semântica
- Evita testes de implementação
- Padrão da comunidade React

### MSW (Mock Service Worker)

**Escolha**: MSW para mocking de APIs
**Motivo**:

- Intercepta requisições de rede
- Mocks realistas
- Funciona em desenvolvimento e testes
- Não precisa modificar código da aplicação

### @testing-library/user-event

**Escolha**: User Event para simulação de interações
**Motivo**:

- Simulação mais realista que fireEvent
- Eventos compostos (tipo usuário real)
- Melhor cobertura de cenários

---

## 🐳 **CONTAINERIZAÇÃO**

### Docker

**Escolha**: Docker para containerização
**Motivo**:

- Ambiente consistente entre dev/prod
- Isolamento de dependências
- Facilidade de deploy
- Padrão da indústria

### Docker Compose

**Escolha**: Docker Compose para orquestração
**Motivo**:

- Configuração simples para múltiplos serviços
- Rede interna automática
- Variáveis de ambiente centralizadas
- Ideal para desenvolvimento local

### Multi-stage Builds

**Escolha**: Multi-stage builds nos Dockerfiles
**Motivo**:

- Imagens finais menores
- Separação entre build e runtime
- Segurança (não expor código fonte)
- Otimização de layers

---

## 🔧 **FUNCIONALIDADES ESPECÍFICAS**

### Debouncing (500ms)

**Escolha**: Debouncing na busca com 500ms
**Motivo**:

- Reduz requisições desnecessárias
- Melhora performance da aplicação
- UX mais fluida
- Economia de quota da API OMDb

### AbortController

**Escolha**: AbortController para cancelamento
**Motivo**:

- Evita race conditions
- Cancela requisições antigas
- Melhora performance
- Padrão moderno do JavaScript

### localStorage

**Escolha**: localStorage para favoritos
**Motivo**:

- Persistência local sem backend
- Simplicidade de implementação
- Disponível offline
- Adequado para dados não críticos

### Deduplicação Customizada

**Escolha**: Algoritmo próprio de deduplicação
**Motivo**:

- Combinar resultados de filmes e séries
- Evitar duplicatas por ID e título
- Flexibilidade para diferentes critérios
- Melhor UX com resultados únicos

---

## 🚀 **PERFORMANCE**

### Cache Estratégico

**Escolha**: Cache de 1 hora para todas as consultas
**Motivo**:

- Dados de filmes são estáticos
- Reduz chamadas à API OMDb (limite 1000/dia)
- Melhora tempo de resposta
- Reduz custos de API

### Lazy Loading

**Escolha**: Lazy loading de imagens
**Motivo**:

- Carregamento inicial mais rápido
- Economia de banda
- Melhor performance em mobile
- UX progressiva

### Paginação Inteligente

**Escolha**: Paginação combinada (filmes + séries)
**Motivo**:

- Reduz volume de dados
- Melhora performance
- UX consistente
- Aproveita paginação da API OMDb

---

## 🔒 **SEGURANÇA**

### CORS Configurado

**Escolha**: CORS específico para localhost:3000
**Motivo**:

- Segurança em desenvolvimento
- Evita requisições de origens não autorizadas
- Facilmente configurável para produção
- Padrão de segurança web

### Validação de Entrada

**Escolha**: Validação no backend e frontend
**Motivo**:

- Dupla camada de segurança
- Prevenção de ataques de injeção
- Feedback imediato ao usuário
- Robustez da aplicação

### Rate Limiting

**Escolha**: 100 requisições por minuto
**Motivo**:

- Proteção contra spam
- Preservação da quota da API
- Prevenção de ataques DDoS
- Uso justo dos recursos

---

## 📊 **MONITORAMENTO**

### Logs Estruturados

**Escolha**: Logs com níveis e contexto
**Motivo**:

- Debugging mais eficiente
- Monitoramento de performance
- Rastreamento de erros
- Análise de uso

### Métricas de Cache

**Escolha**: Estatísticas de cache visíveis
**Motivo**:

- Otimização de performance
- Monitoramento de hit rate
- Identificação de problemas
- Validação da estratégia

---

## 🎯 **DECISÕES DE UX/UI**

### Design Dark Theme

**Escolha**: Tema escuro inspirado no Netflix
**Motivo**:

- Moderno e elegante
- Reduz fadiga visual
- Destaca conteúdo visual (posters)
- Tendência atual do mercado

### Sidebar Expansível

**Escolha**: Sidebar que expande no hover
**Motivo**:

- Aproveita melhor o espaço
- UX fluida
- Navegação intuitiva
- Foco no conteúdo principal

### Loading States

**Escolha**: Loading states específicos
**Motivo**:

- Feedback visual constante
- Reduz ansiedade do usuário
- UX profissional
- Indicação de progresso

---

## 🔄 **INTEGRAÇÃO COM APIs**

### OMDb API

**Escolha**: OMDb como fonte de dados
**Motivo**:

- API gratuita e confiável
- Dados ricos de filmes e séries
- Documentação clara
- Quota adequada para desenvolvimento

### Endpoints Unificados

**Escolha**: Endpoints separados para filmes e séries
**Motivo**:

- Flexibilidade de implementação
- Melhor organização do código
- Possibilidade de cache específico
- Facilita manutenção

---

## 📝 **DOCUMENTAÇÃO**

### READMEs Detalhados

**Escolha**: READMEs completos para cada parte
**Motivo**:

- Facilita onboarding de novos desenvolvedores
- Documentação de funcionalidades
- Guias de instalação e uso
- Profissionalismo do projeto

### Swagger UI

**Escolha**: Documentação interativa da API
**Motivo**:

- Testes diretos dos endpoints
- Documentação sempre atualizada
- Facilita integração
- Padrão da indústria

---

## 🎁 **FUNCIONALIDADES EXTRAS**

### Sistema de Favoritos

**Escolha**: Favoritos com localStorage
**Motivo**:

- Funcionalidade esperada pelos usuários
- Persistência local
- Não requer backend adicional
- Melhora engajamento

### Notificações

**Escolha**: Sistema de notificações customizado
**Motivo**:

- Feedback visual para ações
- UX mais rica
- Confirmações de operações
- Profissionalismo da aplicação

### Filtros Avançados

**Escolha**: Filtros por ano, tipo e ordenação
**Motivo**:

- Melhora descoberta de conteúdo
- Funcionalidade avançada
- UX superior
- Diferencial competitivo

---

## 🚀 **RESULTADO FINAL**

Esta combinação de tecnologias resultou em uma aplicação:

- **Robusta** e **escalável**
- **Performática** e **responsiva**
- **Bem testada** e **documentada**
- **Fácil de manter** e **estender**
- **Pronta para produção**

Cada tecnologia foi escolhida pensando em **qualidade**, **performance**, **manutenibilidade** e **experiência do usuário**, resultando em um produto final de alta qualidade técnica.
