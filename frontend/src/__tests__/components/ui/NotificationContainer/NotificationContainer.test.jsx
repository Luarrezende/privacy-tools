import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NotificationContainer from '../../../../components/ui/NotificationContainer/NotificationContainer';
import * as NotificationContext from '../../../../context/NotificationContext';

const mockRemoveNotification = vi.fn();
const mockAddNotification = vi.fn();
const mockUseNotifications = vi.fn();

vi.mock('../../../../context/NotificationContext', () => ({
    useNotifications: vi.fn(),
}));

describe('NotificationContainer Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseNotifications.mockReturnValue({
            notifications: [],
            removeNotification: mockRemoveNotification,
            addNotification: mockAddNotification,
        });
        vi.mocked(NotificationContext.useNotifications).mockImplementation(mockUseNotifications);
    });

    describe('Teste do evento customizado de notificação', () => {
        it('deve adicionar notificação quando evento showNotification é disparado', () => {
            render(<NotificationContainer />);
            
            const event = new CustomEvent('showNotification', {
                detail: { message: 'Test message', type: 'success', duration: 3000 }
            });
            
            window.dispatchEvent(event);
            
            expect(mockAddNotification).toHaveBeenCalledWith('Test message', 'success', 3000);
        });

        it('deve extrair message, type e duration do event.detail', () => {
            render(<NotificationContainer />);
            
            const event = new CustomEvent('showNotification', {
                detail: { message: 'Error message', type: 'error', duration: 5000 }
            });
            
            window.dispatchEvent(event);
            
            expect(mockAddNotification).toHaveBeenCalledWith('Error message', 'error', 5000);
        });
    });

    describe('Teste da função getIcon', () => {
        it('deve retornar ícone correto para type success', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Success', type: 'success' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(screen.getByText('Success')).toBeInTheDocument();
            expect(document.querySelector('.fas.fa-check-circle')).toBeInTheDocument();
        });

        it('deve retornar ícone correto para type error', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Error', type: 'error' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(document.querySelector('.fas.fa-times-circle')).toBeInTheDocument();
        });

        it('deve retornar ícone correto para type warning', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Warning', type: 'warning' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(document.querySelector('.fas.fa-exclamation-triangle')).toBeInTheDocument();
        });

        it('deve retornar ícone correto para type info', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Info', type: 'info' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(document.querySelector('.fas.fa-info-circle')).toBeInTheDocument();
        });

        it('deve retornar ícone padrão para type desconhecido', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Unknown', type: 'unknown' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(document.querySelector('.fas.fa-info-circle')).toBeInTheDocument();
        });
    });

    describe('Teste da função handleClose', () => {
        it('deve chamar removeNotification com id correto', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 123, message: 'Test', type: 'info' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            const closeButton = screen.getByRole('button');
            fireEvent.click(closeButton);
            
            expect(mockRemoveNotification).toHaveBeenCalledWith(123);
        });
    });

    describe('Teste da renderização das notificações', () => {
        it('deve renderizar container com notificações', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [
                    { id: 1, message: 'First notification', type: 'success' },
                    { id: 2, message: 'Second notification', type: 'error' }
                ],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(screen.getByText('First notification')).toBeInTheDocument();
            expect(screen.getByText('Second notification')).toBeInTheDocument();
        });

        it('deve aplicar classes corretas para cada tipo de notificação', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Success message', type: 'success' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            const messageElement = screen.getByText('Success message');
            const contentDiv = messageElement.closest('div');
            const notificationDiv = contentDiv.parentElement;
            
            expect(notificationDiv).toBeInTheDocument();
            expect(notificationDiv.className).toContain('notification');
            expect(notificationDiv.className).toContain('success');
        });

        it('deve renderizar ícone e mensagem dentro do content', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Test message', type: 'info' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            const messageElement = screen.getByText('Test message');
            expect(messageElement).toBeInTheDocument();
            expect(messageElement.className).toContain('message');
        });

        it('deve renderizar botão de fechar com ícone correto', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [{ id: 1, message: 'Test', type: 'info' }],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            const closeButton = screen.getByRole('button');
            expect(closeButton).toBeInTheDocument();
            expect(closeButton.querySelector('.fas.fa-times')).toBeInTheDocument();
        });

        it('deve renderizar múltiplas notificações com keys únicas', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [
                    { id: 1, message: 'First', type: 'success' },
                    { id: 2, message: 'Second', type: 'error' },
                    { id: 3, message: 'Third', type: 'warning' }
                ],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            render(<NotificationContainer />);
            
            expect(screen.getByText('First')).toBeInTheDocument();
            expect(screen.getByText('Second')).toBeInTheDocument();
            expect(screen.getByText('Third')).toBeInTheDocument();
            expect(screen.getAllByRole('button')).toHaveLength(3);
        });

        it('deve retornar null quando não há notificações', () => {
            mockUseNotifications.mockReturnValue({
                notifications: [],
                removeNotification: mockRemoveNotification,
                addNotification: mockAddNotification,
            });
            
            const { container } = render(<NotificationContainer />);
            
            expect(container.firstChild).toBeNull();
        });
    });
});
