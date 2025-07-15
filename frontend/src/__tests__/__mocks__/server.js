import { setupServer } from 'msw/node';
import { movieHandlers } from './handlers/movieHandlers';
import { seriesHandlers } from './handlers/seriesHandlers';

// Configura o servidor de mock com todos os handlers
export const server = setupServer(
    ...movieHandlers,
    ...seriesHandlers
);
