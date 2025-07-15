# Estrutura de Testes - Frontend

Esta documentação explica a estrutura de testes criada para o projeto usando **React Testing Library (RTL)**, **Vitest** e **MSW (Mock Service Worker)**.

## 📁 Estrutura de Pastas

```
src/
├── __tests__/
│   ├── __mocks__/           # Mocks para APIs e dados
│   │   ├── server.js        # Configuração do MSW
│   │   ├── contextMocks.jsx # Mocks dos Context APIs
│   │   ├── handlers/        # Handlers do MSW por feature
│   │   │   ├── movieHandlers.js
│   │   │   └── seriesHandlers.js
│   │   └── data/           # Dados mockados
│   │       ├── mockMovies.js
│   │       └── mockSeries.js
│   ├── components/         # Testes dos componentes
│   │   └── ui/
│   ├── pages/             # Testes das páginas
│   │   ├── Home/
│   │   ├── Favorites/
│   │   ├── MovieDetails/
│   │   ├── SeriesDetails/
│   │   └── NotFound/
│   ├── context/           # Testes dos Context APIs
│   ├── layouts/           # Testes dos layouts
│   ├── router/            # Testes das rotas
│   ├── integration/       # Testes de integração
│   ├── e2e/              # Testes end-to-end (futuro)
│   ├── helpers/          # Utilitários para testes
│   │   └── testHelpers.js
│   ├── test-utils.jsx    # Render customizado com providers
│   └── App.test.jsx      # Teste principal da aplicação
├── test-setup.js         # Configuração global dos testes
├── vitest.config.js      # Configuração do Vitest
└── package.json          # Dependências e scripts
```

## 🚀 Scripts Disponíveis

```bash
# Executa os testes em modo watch
npm run test

# Executa os testes com interface gráfica
npm run test:ui

# Executa os testes uma vez (CI)
npm run test:run

# Executa os testes com cobertura
npm run test:coverage
```

## 🧪 Tecnologias de Teste

### **Vitest**

- Framework de teste rápido e moderno
- Compatível com Jest API
- HMR (Hot Module Replacement) para testes
- Suporte nativo ao ES modules

### **React Testing Library (RTL)**

- Testa componentes como o usuário os utiliza
- Foca em acessibilidade e semântica
- Evita detalhes de implementação

### **MSW (Mock Service Worker)**

- Intercepta requisições de rede
- Simula APIs realistas
- Funciona tanto em desenvolvimento quanto em testes

### **@testing-library/user-event**

- Simula interações reais do usuário
- Mais realista que `fireEvent`

## 🛠️ Como Escrever Testes

### 1. **Teste de Componente Básico**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});
```

### 2. **Teste com Interação do Usuário**

```jsx
import { createUser } from '@/test-utils/helpers/testHelpers';

describe('Interactive Component', () => {
  it('should handle click events', async () => {
    const user = createUser();
    render(<Button />);
  
    const button = screen.getByRole('button');
    await user.click(button);
  
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
```

### 3. **Teste com Context**

```jsx
import { render, screen } from '@/test-utils';
import { mockSearchContext } from '@/test-utils/__mocks__/contextMocks';

describe('Component with Context', () => {
  it('should use context values', () => {
    const customContext = {
      ...mockSearchContext,
      searchQuery: 'batman'
    };
  
    render(<SearchComponent />, {
      providers: [
        ({ children }) => (
          <SearchContext.Provider value={customContext}>
            {children}
          </SearchContext.Provider>
        )
      ]
    });
  
    expect(screen.getByDisplayValue('batman')).toBeInTheDocument();
  });
});
```

### 4. **Teste com API Mock**

```jsx
import { server } from '@/test-utils/__mocks__/server';
import { http, HttpResponse } from 'msw';

describe('API Integration', () => {
  it('should handle API success', async () => {
    server.use(
      http.get('/api/movies', () => {
        return HttpResponse.json({ results: mockMovies });
      })
    );
  
    render(<MovieList />);
  
    await waitFor(() => {
      expect(screen.getByText('The Dark Knight')).toBeInTheDocument();
    });
  });
  
  it('should handle API error', async () => {
    server.use(
      http.get('/api/movies', () => {
        return HttpResponse.json(
          { message: 'Server error' },
          { status: 500 }
        );
      })
    );
  
    render(<MovieList />);
  
    await waitFor(() => {
      expect(screen.getByText('Error loading movies')).toBeInTheDocument();
    });
  });
});
```

## 📊 Cobertura de Testes

### **Metas de Cobertura**

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### **Arquivos Excluídos da Cobertura**

- `node_modules/`
- Arquivos de teste (`*.test.js`, `*.spec.js`)
- Mocks e setup de teste
- Arquivos de configuração
- Diretório `public/`

## 🎯 Estratégias de Teste

### **1. Testes Unitários**

- Componentes isolados
- Funções utilitárias
- Context APIs
- Hooks customizados

### **2. Testes de Integração**

- Fluxos de navegação
- Interação entre componentes
- Context + Componentes
- APIs + UI

## 🚨 Boas Práticas

### **1. Nomenclatura**

```
ComponentName.test.jsx    # Testes de componentes
api.test.js              # Testes de API/utilitários
integration.test.jsx     # Testes de integração
```

### **2. Estrutura de Teste**

```jsx
describe('Component/Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Preparação comum
  });

  describe('when condition', () => {
    it('should do something', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### **3. Queries RTL (em ordem de prioridade)**

1. `getByRole()` - Mais semântico
2. `getByLabelText()` - Para formulários
3. `getByText()` - Para conteúdo
4. `getByTestId()` - Último recurso

### **4. Async Testing**

```jsx
// ✅ Bom
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument();
});

// ❌ Evitar
await new Promise(resolve => setTimeout(resolve, 1000));
```

## 🔧 Troubleshooting

### **Problema: Teste falha por timeout**

```jsx
// Aumentar timeout específico
await waitFor(() => {
  expect(element).toBeInTheDocument();
}, { timeout: 5000 });
```

### **Problema: Mock não funciona**

```jsx
// Verificar se o mock está sendo resetado
afterEach(() => {
  vi.clearAllMocks();
});
```

### **Problema: Context não está disponível**

```jsx
// Usar o render customizado
import { render } from '@/test-utils'; // ✅
// ao invés de
import { render } from '@testing-library/react'; // ❌
```

## 📚 Recursos Adicionais

- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Docs](https://vitest.dev/)
- [MSW Docs](https://mswjs.io/)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
