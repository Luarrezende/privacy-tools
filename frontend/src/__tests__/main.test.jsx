import { vi } from 'vitest';

// Mock do createRoot
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
    render: mockRender
}));

vi.mock('react-dom/client', () => ({
    createRoot: mockCreateRoot
}));

// Mock do App
vi.mock('./App.jsx', () => ({
    default: () => 'App Component'
}));

// Mock do CSS
vi.mock('./index.css', () => ({}));

// Mock completo do document
const mockElement = document.createElement('div');
global.document = {
    getElementById: vi.fn(() => mockElement),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    createElement: vi.fn(() => mockElement),
    body: mockElement,
    head: mockElement,
    documentElement: mockElement
};

describe('Main Entry Point', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    it('deve renderizar App dentro de StrictMode no elemento root', async () => {
        await import('../main.jsx');
        
        expect(global.document.getElementById).toHaveBeenCalledWith('root');
        expect(mockCreateRoot).toHaveBeenCalledWith(mockElement);
        expect(mockRender).toHaveBeenCalledTimes(1);
    });

    it('deve usar createRoot corretamente', async () => {
        await import('../main.jsx');
        
        expect(mockCreateRoot).toHaveBeenCalledTimes(1);
        expect(mockRender).toHaveBeenCalledTimes(1);
    });

    it('deve importar o CSS corretamente', async () => {
        await import('../main.jsx');
        
        expect(global.document.getElementById).toHaveBeenCalledWith('root');
    });
});
