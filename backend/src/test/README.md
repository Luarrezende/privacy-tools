# Estrutura de Testes - Privacy Tools Backend

## 📁 Estrutura Criada

```
src/test/java/com/luarrezende/backend/
├── BackendApplicationTests.java          # Teste de contexto principal
├── BaseIntegrationTest.java             # Classe base para testes de integração
├── controller/                          # Testes de controller (Web Layer)
│   └── MoviesControllerTest.java
├── service/                            # Testes de service (Business Logic)
│   └── MoviesServiceTest.java
├── config/                             # Testes de configuração
│   └── ConfigurationTest.java
├── integration/                        # Testes de integração end-to-end
│   └── MoviesIntegrationTest.java
└── unit/                              # Testes unitários puros
    └── MovieDetailsResponseTest.java

src/test/resources/
└── application-test.properties         # Configurações específicas para testes
```

## 🛠️ Dependências de Teste Disponíveis

### ✅ Já Configuradas no POM:
- **Spring Boot Test Starter** - Framework completo de testes
- **JUnit 5** - Framework de testes principal
- **Mockito** - Para mocking de dependências
- **AssertJ** - Assertions fluentes e expressivas
- **Spring Security Test** - Para testes de segurança
- **JSON Path** - Para testes de resposta JSON
- **JaCoCo** - Para cobertura de código

## 📋 Tipos de Teste Implementados

### 1. **Testes de Controller** (`@WebMvcTest`)
- Testa apenas a camada web
- Mock das dependências (services)
- Validação de requisições/respostas HTTP
- Teste de parâmetros e validações

### 2. **Testes de Service** (`@ExtendWith(MockitoExtension.class)`)
- Testa a lógica de negócio
- Mock de dependências externas (RestTemplate)
- Validação de comportamento e fluxos

### 3. **Testes de Configuração** (`@SpringBootTest`)
- Verifica se beans são criados corretamente
- Testa configurações de cache, RestTemplate, etc.

### 4. **Testes de Integração** (`@SpringBootTest`)
- Testa a aplicação completa
- Validação end-to-end dos fluxos
- Configurações específicas para teste

### 5. **Testes Unitários Puros**
- Sem contexto Spring
- Testa classes isoladamente (DTOs, utils, etc.)
- Rápidos e independentes

## 🚀 Como Executar

### Executar todos os testes:
```bash
mvn test
```

### Executar testes específicos:
```bash
# Apenas testes de controller
mvn test -Dtest="*ControllerTest"

# Apenas testes de service
mvn test -Dtest="*ServiceTest"

# Apenas testes de integração
mvn test -Dtest="*IntegrationTest"
```

### Gerar relatório de cobertura (JaCoCo):
```bash
mvn test jacoco:report
```
*Relatório gerado em: `target/site/jacoco/index.html`*

## 📊 Padrões e Convenções

### Nomenclatura:
- **Controller Tests**: `*ControllerTest.java`
- **Service Tests**: `*ServiceTest.java`
- **Integration Tests**: `*IntegrationTest.java`
- **Unit Tests**: `*Test.java` (na pasta unit/)

### Estrutura de Teste (AAA Pattern):
```java
@Test
void shouldDoSomething() {
    // Given (Arrange)
    // Preparação dos dados e mocks
    
    // When (Act)
    // Execução do método testado
    
    // Then (Assert)
    // Verificação dos resultados
}
```

### Anotações Importantes:
- `@DisplayName` - Descrição legível do teste
- `@Test` - Marca o método como teste
- `@MockBean` - Mock gerenciado pelo Spring
- `@Mock` - Mock do Mockito
- `@WebMvcTest` - Teste de controller
- `@SpringBootTest` - Teste com contexto completo

## 🔧 Próximos Passos

1. **Implementar mocks externos** para APIs (WireMock)
2. **Adicionar testes de performance** (JMeter integration)
3. **Configurar testes de segurança** específicos
4. **Implementar testes de cache** mais detalhados
5. **Adicionar testes de rate limiting**

## 📝 Exemplos de Uso

### Mock de Service:
```java
@MockBean
private MoviesService moviesService;

when(moviesService.searchMovie(anyString()))
    .thenReturn(ResponseEntity.ok(mockResponse));
```

### Teste de API:
```java
mockMvc.perform(get("/api/movies/search")
        .param("title", "Matrix"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("The Matrix"));
```

### Assertions com AssertJ:
```java
assertThat(response)
    .isNotNull()
    .extracting(MovieDetailsResponse::getTitle)
    .isEqualTo("The Matrix");
```
