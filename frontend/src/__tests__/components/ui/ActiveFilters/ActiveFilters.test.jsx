import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ActiveFilters from '../../../../components/ui/ActiveFilters/ActiveFilters';

vi.mock('../../../../constants/filters', () => ({
    filterOptions: {
        types: [
            { value: 'movie', label: 'Filme' },
            { value: 'series', label: 'Série' }
        ],
        years: [
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' }
        ],
        sortOptions: [
            { value: 'relevance', label: 'Relevância' },
            { value: 'year', label: 'Ano' },
            { value: 'title', label: 'Título' }
        ]
    }
}));

describe('ActiveFilters Component', () => {
    const mockOnRemoveFilter = vi.fn();
    const mockOnClearAll = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Teste de processamento de filtros ativos', () => {
        it('deve processar filtros type corretamente', () => {
            const filters = { type: 'movie', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Filme')).toBeInTheDocument();
        });

        it('deve processar filtros year corretamente', () => {
            const filters = { type: '', year: '2023', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('2023')).toBeInTheDocument();
        });

        it('deve ignorar filtros vazios e sortBy', () => {
            const filters = { type: '', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.queryByText('Filtros Aplicados')).not.toBeInTheDocument();
        });

        it('deve usar valor padrão quando não encontra label', () => {
            const filters = { type: 'unknown', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('unknown')).toBeInTheDocument();
        });
    });

    describe('Teste do header e botão Limpar Tudo', () => {
        it('deve renderizar header com título e ícone', () => {
            const filters = { type: 'movie', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Filtros Aplicados')).toBeInTheDocument();
            expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
        });

        it('deve renderizar botão Limpar Tudo quando há filtros ativos', () => {
            const filters = { type: 'movie', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            const clearButton = screen.getByText('Limpar Tudo');
            expect(clearButton).toBeInTheDocument();
            expect(clearButton).toHaveAttribute('title', 'Limpar todos os filtros');
        });

        it('deve renderizar botão Limpar Tudo quando há sortBy diferente de relevance', () => {
            const filters = { type: '', year: '', sortBy: 'year' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Limpar Tudo')).toBeInTheDocument();
        });

        it('deve chamar onClearAll quando botão Limpar Tudo é clicado', () => {
            const filters = { type: 'movie', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            const clearButton = screen.getByText('Limpar Tudo');
            fireEvent.click(clearButton);
            
            expect(mockOnClearAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('Teste da renderização dos filtros ativos', () => {
        it('deve renderizar filtros ativos com labels corretos', () => {
            const filters = { type: 'movie', year: '2023', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Filme')).toBeInTheDocument();
            expect(screen.getByText('2023')).toBeInTheDocument();
        });

        it('deve renderizar botões de remoção para cada filtro', () => {
            const filters = { type: 'movie', year: '2023', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            const removeButtons = screen.getAllByTitle(/Remover filtro:/);
            expect(removeButtons).toHaveLength(2);
            expect(removeButtons[0]).toHaveAttribute('title', 'Remover filtro: Filme');
            expect(removeButtons[1]).toHaveAttribute('title', 'Remover filtro: 2023');
        });

        it('deve chamar onRemoveFilter com key correta ao clicar no botão de remoção', () => {
            const filters = { type: 'movie', year: '2023', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            const typeRemoveButton = screen.getByTitle('Remover filtro: Filme');
            fireEvent.click(typeRemoveButton);
            
            expect(mockOnRemoveFilter).toHaveBeenCalledWith('type');
            
            const yearRemoveButton = screen.getByTitle('Remover filtro: 2023');
            fireEvent.click(yearRemoveButton);
            
            expect(mockOnRemoveFilter).toHaveBeenCalledWith('year');
        });
    });

    describe('Teste da ordenação', () => {
        it('deve renderizar tag de ordenação quando sortBy não é relevance', () => {
            const filters = { type: '', year: '', sortBy: 'year' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Ano')).toBeInTheDocument();
        });

        it('não deve renderizar tag de ordenação quando sortBy é relevance', () => {
            const filters = { type: '', year: '', sortBy: 'relevance' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.queryByText('Relevância')).not.toBeInTheDocument();
        });

        it('deve renderizar ícone de ordenação e botão de remoção', () => {
            const filters = { type: '', year: '', sortBy: 'title' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Título')).toBeInTheDocument();
            
            const sortRemoveButton = screen.getByTitle('Remover ordenação: Título');
            expect(sortRemoveButton).toBeInTheDocument();
        });

        it('deve chamar onRemoveFilter com sortBy ao clicar no botão de remoção da ordenação', () => {
            const filters = { type: '', year: '', sortBy: 'title' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            const sortRemoveButton = screen.getByTitle('Remover ordenação: Título');
            fireEvent.click(sortRemoveButton);
            
            expect(mockOnRemoveFilter).toHaveBeenCalledWith('sortBy');
        });
    });

    describe('Teste de condições especiais', () => {
        it('deve retornar null quando não há filtros ativos nem sortBy', () => {
            const filters = { type: '', year: '', sortBy: 'relevance' };
            
            const { container } = render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(container.firstChild).toBeNull();
        });

        it('deve renderizar componente quando há filtros ativos e sortBy diferente de relevance', () => {
            const filters = { type: 'movie', year: '2023', sortBy: 'year' };
            
            render(
                <ActiveFilters 
                    filters={filters} 
                    onRemoveFilter={mockOnRemoveFilter} 
                    onClearAll={mockOnClearAll} 
                />
            );
            
            expect(screen.getByText('Filtros Aplicados')).toBeInTheDocument();
            expect(screen.getByText('Filme')).toBeInTheDocument();
            expect(screen.getByText('2023')).toBeInTheDocument();
            expect(screen.getByText('Ano')).toBeInTheDocument();
        });
    });
});
