import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useNotifications, NotificationProvider } from '../../context/NotificationContext';

const TestComponent = () => {
    const { notifications, addNotification, removeNotification, clearAllNotifications } = useNotifications();

    return (
        <div>
            <div data-testid="notification-count">{notifications.length}</div>
            <button onClick={() => addNotification('Test message', 'success', 1000)}>
                Add Notification
            </button>
            <button onClick={() => removeNotification(notifications[0]?.id)}>
                Remove First
            </button>
            <button onClick={clearAllNotifications}>
                Clear All
            </button>
            {notifications.map(notif => (
                <div key={notif.id} data-testid="notification">
                    {notif.message} - {notif.type}
                </div>
            ))}
        </div>
    );
};

const ComponentWithoutProvider = () => {
    const { notifications } = useNotifications();
    return <div>{notifications.length}</div>;
};

describe('NotificationContext', () => {
    beforeEach(() => {
        vi.clearAllTimers();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    describe('Teste da validação do contexto', () => {
        it('deve lançar erro quando useNotifications é usado fora do provider', () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(() => {
                render(<ComponentWithoutProvider />);
            }).toThrow('useNotifications deve ser usado dentro de NotificationProvider');
            
            consoleError.mockRestore();
        });

        it('deve retornar context quando usado dentro do provider', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
        });
    });

    describe('Teste da função addNotification', () => {
        it('deve criar notification com id único usando Date.now() + Math.random()', () => {
            const mockDateNow = vi.spyOn(Date, 'now').mockReturnValue(1000);
            const mockMathRandom = vi.spyOn(Math, 'random').mockReturnValue(0.5);

            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));

            expect(mockDateNow).toHaveBeenCalled();
            expect(mockMathRandom).toHaveBeenCalled();
            expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

            mockDateNow.mockRestore();
            mockMathRandom.mockRestore();
        });

        it('deve criar notification com message, type e duration corretos', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));

            expect(screen.getByTestId('notification')).toHaveTextContent('Test message - success');
        });

        it('deve adicionar notification ao array prev com spread operator', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('2');
        });

        it('deve configurar setTimeout para remover notification após duration', async () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
        });

        it('deve retornar id da notification criada', () => {
            const TestComponentWithId = () => {
                const { addNotification } = useNotifications();
                const [notificationId, setNotificationId] = React.useState(null);

                const handleAdd = () => {
                    const id = addNotification('Test', 'info', 1000);
                    setNotificationId(id);
                };

                return (
                    <div>
                        <button onClick={handleAdd}>Add</button>
                        <div data-testid="notification-id">{notificationId}</div>
                    </div>
                );
            };

            render(
                <NotificationProvider>
                    <TestComponentWithId />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add'));
            expect(screen.getByTestId('notification-id')).not.toHaveTextContent('null');
        });
    });

    describe('Teste da função removeNotification', () => {
        it('deve filtrar notifications removendo o item com id específico', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));
            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('2');

            fireEvent.click(screen.getByText('Remove First'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('1');
        });

        it('deve usar filter para manter apenas notifications com id diferente', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));
            const firstNotification = screen.getByTestId('notification');
            
            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getAllByTestId('notification')).toHaveLength(2);

            fireEvent.click(screen.getByText('Remove First'));
            expect(screen.getAllByTestId('notification')).toHaveLength(1);
        });
    });

    describe('Teste da função clearAllNotifications', () => {
        it('deve definir notifications como array vazio', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));
            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('2');

            fireEvent.click(screen.getByText('Clear All'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
        });

        it('deve limpar todas as notifications independente da quantidade', () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            for (let i = 0; i < 5; i++) {
                fireEvent.click(screen.getByText('Add Notification'));
            }
            expect(screen.getByTestId('notification-count')).toHaveTextContent('5');

            fireEvent.click(screen.getByText('Clear All'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
        });
    });

    describe('Teste de integração', () => {
        it('deve funcionar com valores padrão de addNotification', () => {
            const TestComponentDefaults = () => {
                const { notifications, addNotification } = useNotifications();

                return (
                    <div>
                        <button onClick={() => addNotification('Default message')}>
                            Add Default
                        </button>
                        {notifications.map(notif => (
                            <div key={notif.id} data-testid="notification">
                                {notif.message} - {notif.type} - {notif.duration}
                            </div>
                        ))}
                    </div>
                );
            };

            render(
                <NotificationProvider>
                    <TestComponentDefaults />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Default'));
            expect(screen.getByTestId('notification')).toHaveTextContent('Default message - success - 3000');
        });

        it('deve remover notification automaticamente após timeout', async () => {
            render(
                <NotificationProvider>
                    <TestComponent />
                </NotificationProvider>
            );

            fireEvent.click(screen.getByText('Add Notification'));
            expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

            act(() => {
                vi.advanceTimersByTime(999);
            });
            expect(screen.getByTestId('notification-count')).toHaveTextContent('1');

            act(() => {
                vi.advanceTimersByTime(1);
            });
            expect(screen.getByTestId('notification-count')).toHaveTextContent('0');
        });
    });
});
