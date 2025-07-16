# 🎬 Privacy Tools - Frontend

Interface moderna para busca de filmes e séries, desenvolvida com React 19 e Vite.

## 📋 Pré-requisitos

- **Node.js 18+** ou superior
- **npm** ou **yarn**
- **Backend rodando** em `http://localhost:8080`

## 🚀 Como Executar

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd privacy-tools/frontend
```

### 2. Instalar Dependências

```bash
# Com npm
npm install

# Com yarn
yarn install
```

### 3. Executar em Desenvolvimento

```bash
# Com npm
npm run dev

# Com yarn
yarn dev
```

### 4. Verificar se está Funcionando

Acesse: `http://localhost:5173`

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build

# Testes
npm run test         # Executar testes
npm run test:ui      # Interface dos testes
npm run test:run     # Executar todos os testes
npm run test:coverage # Cobertura de testes

# Linting
npm run lint         # Verificar código
```

## 🐳 Docker

### Construir Imagem

```bash
docker build -t privacy-tools-frontend .
```

### Executar Container

```bash
docker run -p 3000:3000 privacy-tools-frontend
```

### Docker Compose (Recomendado)

```bash
# Na raiz do projeto
docker-compose up -d
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Privacy Tools
```

### Configuração da API

Arquivo: `src/constants/api.js`

```javascript
export const apiBaseUrlL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
```

## 📊 Executar Testes

```bash
# Todos os testes
npm run test

# Testes com interface
npm run test:ui

# Cobertura de testes
npm run test:coverage

# Visualizar cobertura
open coverage/index.html
```

## 🎨 Funcionalidades

### ✅ Implementadas

- [X]  Busca em tempo real com debouncing
- [X]  Filtros avançados (ano, tipo, ordenação)
- [X]  Paginação inteligente
- [X]  Sistema de favoritos persistente
- [X]  Navegação fluida entre páginas
- [X]  Design responsivo
- [X]  Loading states e error handling
- [X]  Cancelamento de requisições automático
- [X]  Deduplicação de resultados
- [X]  Detalhes de filmes e séries
- [X]  Navegação por temporadas e episódios
- [X]  Sistema de notificações
- [X]  Tema escuro moderno

### 🔄 Estados de Loading

- Busca de conteúdo
- Carregamento de detalhes
- Carregamento de temporadas
- Feedback visual em tempo real

### 💾 Persistência

- Favoritos salvos no localStorage
- Estado de filtros preservado
- Histórico de navegação

## 🏗️ Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   └── ui/             # Componentes de interface
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home/           # Página inicial
│   │   ├── MovieDetails/   # Detalhes do filme
│   │   ├── SeriesDetails/  # Detalhes da série
│   │   ├── Favorites/      # Página de favoritos
│   │   └── NotFound/       # Página 404
│   ├── context/            # Contextos React
│   │   ├── SearchContext.jsx    # Busca e filtros
│   │   ├── FavoritesContext.jsx # Sistema de favoritos
│   │   └── NotificationContext.jsx # Notificações
│   ├── layouts/            # Layouts da aplicação
│   │   └── MainLayout.jsx  # Layout principal
│   ├── router/             # Configuração de rotas
│   │   └── AppRouter.jsx   # Router principal
│   ├── utils/              # Utilitários
│   │   ├── deduplication.js     # Deduplicação
│   │   └── contentTypes.js      # Tipos de conteúdo
│   ├── constants/          # Constantes
│   │   ├── api.js          # Configuração da API
│   │   └── filters.js      # Opções de filtros
│   ├── assets/             # Recursos estáticos
│   ├── __tests__/          # Testes
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Ponto de entrada
├── public/                 # Arquivos públicos
├── coverage/               # Relatório de cobertura
├── package.json           # Dependências
├── vite.config.js         # Configuração Vite
└── vitest.config.js       # Configuração testes
```

## 🛠️ Tecnologias Utilizadas

### Core

- **React 19.1.0** - Framework principal
- **Vite 7.0.4** - Build tool e dev server
- **React Router DOM 7.6.3** - Navegação SPA

### Desenvolvimento

- **Vitest 2.0.5** - Framework de testes
- **@testing-library/react 16.0.1** - Testes de componentes
- **@testing-library/user-event** - Simulação de eventos
- **MSW 2.3.5** - Mock Service Worker
- **ESLint** - Linting e qualidade de código

### Estilização

- **CSS Modules** - Estilização isolada
- **Font Awesome** - Ícones
- **Design System** - Tema escuro moderno

## 🎯 Páginas e Funcionalidades

### 🏠 Home (`/`)

- Busca unificada de filmes e séries
- Filtros por ano, tipo e ordenação
- Paginação inteligente
- Grid responsivo de resultados

### 🎬 Movie Details (`/movies/:id`)

- Detalhes completos do filme
- Poster, sinopse, elenco
- Avaliações e prêmios
- Botão de favoritos

### 📺 Series Details (`/series/:id`)

- Detalhes completos da série
- Lista de temporadas expansível
- Episódios por temporada
- Navegação por temporadas

### ❤️ Favorites (`/favorites`)

- Lista de favoritos salvos
- Filtros por tipo (filme/série)
- Estatísticas de favoritos
- Gerenciamento de lista

## 🔧 Configurações Avançadas

### Performance

- Debouncing de busca (500ms)
- Cancelamento automático de requisições
- Lazy loading de componentes
- Memoização de resultados

### Acessibilidade

- Semantic HTML
- ARIA labels
- Navegação por teclado
- Contraste adequado

### Responsividade

- Mobile-first design
- Breakpoints otimizados
- Touch-friendly interface
- Sidebar adaptativa

## 🐛 Solução de Problemas

### Erro: "Port 5173 already in use"

```bash
# Mude a porta no vite.config.js
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### Erro: "Backend não encontrado"

```bash
# Verifique se o backend está rodando
curl http://localhost:8080/test

# Verifique a configuração da API
cat src/constants/api.js
```

### Erro: "Node version"

```bash
# Verifique a versão do Node
node -v

# Deve ser 18 ou superior
```

### Erro: "Dependencies not found"

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## 📊 Testes

### Estrutura de Testes

```
src/__tests__/
├── components/          # Testes de componentes
├── pages/              # Testes de páginas
├── context/            # Testes de contextos
├── utils/              # Testes de utilitários
├── helpers/            # Helpers de teste
└── __mocks__/          # Mocks globais
```

### Cobertura de Testes

- **Componentes**: ~85%
- **Contextos**: ~90%
- **Utilitários**: ~95%
- **Páginas**: ~80%

### Comandos de Teste

```bash
# Executar todos os testes
npm run test

# Testes com interface
npm run test:ui

# Cobertura detalhada
npm run test:coverage
```

## 🚀 Build e Deploy

### Build de Produção

```bash
# Gerar build
npm run build

# Preview do build
npm run preview

# Arquivos gerados em dist/
```

### Deploy

```bash
# Exemplo com Netlify
netlify deploy --prod --dir=dist

# Exemplo com Vercel
vercel --prod

# Exemplo com servidor próprio
scp -r dist/* user@server:/var/www/html/
```

## 🔐 Segurança

### Boas Práticas

- Sanitização de inputs
- Validação de dados da API
- Headers de segurança configurados
- Dependências atualizadas

### Configurações

```javascript
// vite.config.js
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  }
})
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique o console do navegador
2. Execute os testes: `npm run test`
3. Verifique a documentação do componente
4. Consulte as issues no repositório
5. Me manda mensagem no WhatsApp (Luar)

## 🎨 Customização

### Temas

- Modificar variáveis CSS em `src/index.css`
- Cores principais em CSS custom properties
- Componentes modulares para fácil customização

### Adicionando Funcionalidades

1. Criar componente em `src/components/`
2. Adicionar testes em `src/__tests__/`
3. Integrar com contextos existentes
4. Atualizar rotas se necessário

---

**Desenvolvido com ❤️ usando React + Vite**
