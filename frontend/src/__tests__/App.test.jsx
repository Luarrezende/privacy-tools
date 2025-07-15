// Testes do App.jsx
import { render, screen } from '@testing-library/react';
import App from '../App';
import { MockSearchProvider, MockFavoritesProvider, MockNotificationProvider } from './__mocks__/contextMocks';

describe('App Component', () => {
    beforeEach(() => {
        render(
        <MockSearchProvider>
            <MockFavoritesProvider>
                <MockNotificationProvider>
                    <App />
                </MockNotificationProvider>
            </MockFavoritesProvider>
        </MockSearchProvider>
        );
    });

    it('Deve verificar se o body foi carregado', () => {
        expect(screen.getByText('Comece sua busca')).toBeInTheDocument();
        expect(screen.getByText('Clique no icone de pesquisa para encontrar filmes e séries')).toBeInTheDocument();
    });

});
