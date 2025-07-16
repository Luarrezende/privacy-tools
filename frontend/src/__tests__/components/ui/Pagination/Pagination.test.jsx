import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Pagination from '../../../../components/ui/Pagination/Pagination';

describe('Pagination Component', () => {
    const mockOnPageChange = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Teste da validação de página', () => {
        it('deve chamar onPageChange quando page é válida', () => {
            render(
                <Pagination
                    currentPage={2}
                    totalPages={5}
                    totalResults={50}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const pageButton = screen.getByText('3');
            fireEvent.click(pageButton);

            expect(mockOnPageChange).toHaveBeenCalledWith(3);
        });

        it('deve validar se page >= 1', () => {
            render(
                <Pagination
                    currentPage={1}
                    totalPages={5}
                    totalResults={50}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={false}
                />
            );

            const previousButton = screen.getByText('Anterior');
            fireEvent.click(previousButton);

            expect(mockOnPageChange).not.toHaveBeenCalled();
        });

        it('deve validar se page <= totalPages', () => {
            render(
                <Pagination
                    currentPage={5}
                    totalPages={5}
                    totalResults={50}
                    onPageChange={mockOnPageChange}
                    hasNextPage={false}
                    hasPreviousPage={true}
                />
            );

            const nextButton = screen.getByText('Próximo');
            fireEvent.click(nextButton);

            expect(mockOnPageChange).not.toHaveBeenCalled();
        });
    });

    describe('Teste da renderização dos números de página', () => {
        it('deve calcular startPage e endPage corretamente', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('2')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
            expect(screen.getByText('4')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
        });

        it('deve adicionar botão página 1 quando startPage > 1', () => {
            render(
                <Pagination
                    currentPage={8}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            expect(screen.getByText('1')).toBeInTheDocument();
            expect(screen.getByText('...')).toBeInTheDocument();
        });

        it('deve adicionar ellipsis quando startPage > 2', () => {
            render(
                <Pagination
                    currentPage={8}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const ellipsis = screen.getAllByText('...');
            expect(ellipsis.length).toBeGreaterThan(0);
        });

        it('deve renderizar páginas do loop startPage até endPage', () => {
            render(
                <Pagination
                    currentPage={5}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            for (let i = 3; i <= 7; i++) {
                expect(screen.getByText(i.toString())).toBeInTheDocument();
            }
        });

        it('deve aplicar classe active na página atual', () => {
            render(
                <Pagination
                    currentPage={5}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const currentPageButton = screen.getByText('5');
            expect(currentPageButton.className).toContain('active');
        });

        it('deve adicionar ellipsis quando endPage < totalPages - 1', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const ellipsis = screen.getAllByText('...');
            expect(ellipsis.length).toBeGreaterThan(0);
        });

        it('deve adicionar botão última página quando endPage < totalPages', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            expect(screen.getByText('10')).toBeInTheDocument();
        });

        it('deve chamar handlePageChange ao clicar em número da página', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const pageButton = screen.getByText('4');
            fireEvent.click(pageButton);

            expect(mockOnPageChange).toHaveBeenCalledWith(4);
        });
    });

    describe('Teste do botão Anterior', () => {
        it('deve renderizar botão Anterior', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const previousButton = screen.getByText('Anterior');
            expect(previousButton).toBeInTheDocument();
        });

        it('deve chamar handlePageChange com currentPage - 1', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const previousButton = screen.getByText('Anterior');
            fireEvent.click(previousButton);

            expect(mockOnPageChange).toHaveBeenCalledWith(2);
        });

        it('deve estar desabilitado quando hasPreviousPage é false', () => {
            render(
                <Pagination
                    currentPage={1}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={false}
                />
            );

            const previousButton = screen.getByText('Anterior');
            expect(previousButton).toBeDisabled();
        });

        it('deve aplicar classe disabled quando hasPreviousPage é false', () => {
            render(
                <Pagination
                    currentPage={1}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={false}
                />
            );

            const previousButton = screen.getByText('Anterior');
            expect(previousButton.className).toContain('disabled');
        });

        it('deve renderizar ícone chevron-left', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            expect(document.querySelector('.fas.fa-chevron-left')).toBeInTheDocument();
        });
    });

    describe('Teste de condições especiais', () => {
        it('deve retornar null quando totalPages <= 1', () => {
            const { container } = render(
                <Pagination
                    currentPage={1}
                    totalPages={1}
                    totalResults={10}
                    onPageChange={mockOnPageChange}
                    hasNextPage={false}
                    hasPreviousPage={false}
                />
            );

            expect(container.firstChild).toBeNull();
        });

        it('deve renderizar info com total de resultados', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={250}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            expect(screen.getByText('Total: 250 resultados')).toBeInTheDocument();
        });

        it('deve renderizar botão Próximo', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const nextButton = screen.getByText('Próximo');
            expect(nextButton).toBeInTheDocument();
        });

        it('deve chamar handlePageChange com currentPage + 1 no botão Próximo', () => {
            render(
                <Pagination
                    currentPage={3}
                    totalPages={10}
                    totalResults={100}
                    onPageChange={mockOnPageChange}
                    hasNextPage={true}
                    hasPreviousPage={true}
                />
            );

            const nextButton = screen.getByText('Próximo');
            fireEvent.click(nextButton);

            expect(mockOnPageChange).toHaveBeenCalledWith(4);
        });
    });
});
