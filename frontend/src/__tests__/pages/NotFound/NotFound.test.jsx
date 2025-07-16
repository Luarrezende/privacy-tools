import { render, screen } from '@testing-library/react';
import NotFound from '../../../pages/NotFound/NotFound';

describe('NotFound Component', () => {
    it('deve renderizar título e mensagem 404', () => {
        render(<NotFound />);
        
        expect(screen.getByText('404 - Página não encontrada')).toBeInTheDocument();
        expect(screen.getByText('A página que você está procurando não existe.')).toBeInTheDocument();
    });

    it('deve renderizar com estilos inline corretos', () => {
        render(<NotFound />);
        
        const container = screen.getByText('404 - Página não encontrada').closest('div');
        expect(container).toHaveStyle({
            padding: '2rem',
            textAlign: 'center'
        });
    });

    it('deve ter estrutura HTML correta', () => {
        render(<NotFound />);
        
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404 - Página não encontrada');
        expect(screen.getByText('A página que você está procurando não existe.')).toBeInTheDocument();
    });
});
