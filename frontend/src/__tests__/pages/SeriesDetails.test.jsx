import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import SeriesDetails from '../../pages/SeriesDetails/SeriesDetails';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '123' }),
    };
});

global.fetch = vi.fn();

describe('SeriesDetails', () => {
    const mockSeriesData = {
        id: '123',
        title: 'Breaking Bad',
        year: '2008',
        plot: 'A high school chemistry teacher turned methamphetamine manufacturer.',
        genre: 'Crime, Drama, Thriller',
        actors: 'Bryan Cranston, Aaron Paul, Anna Gunn',
        imdbRating: '9.5',
        poster: 'https://example.com/poster.jpg'
    };

    const mockEpisodes = [
        { episode: 1, title: 'Pilot', plot: 'Walter White starts cooking meth', released: '2008-01-20', imdbRating: '9.0' },
        { episode: 2, title: 'Cat\'s in the Bag...', plot: 'Walter and Jesse face their first crisis', released: '2008-01-27', imdbRating: '8.5' }
    ];

    const renderSeriesDetails = () => render(<BrowserRouter><SeriesDetails /></BrowserRouter>);

    const mockSeriesResponse = () => fetch.mockResolvedValueOnce({ ok: true, json: async () => mockSeriesData });
    const mockSeasonResponse = (episodes = mockEpisodes, success = true) => 
        fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success, episodes, totalSeasons: 5, year: '2008' }) });
    const mockFailedResponse = () => fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    beforeEach(() => {
        vi.clearAllMocks();
        fetch.mockReset();
    });

    describe('Estado inicial e erros', () => {
        it('deve mostrar loading inicial', () => {
            fetch.mockImplementation(() => new Promise(() => {}));
            renderSeriesDetails();
            expect(screen.getByText('Carregando detalhes...')).toBeInTheDocument();
            expect(screen.getByText('Carregando detalhes...').parentElement.querySelector('.fas.fa-spinner.fa-spin')).toBeInTheDocument();
        });

        it('deve mostrar erro quando a API falha', async () => {
            mockFailedResponse();
            renderSeriesDetails();
            await waitFor(() => expect(screen.getByText('Série não encontrada')).toBeInTheDocument());
            expect(screen.getByText('Erro')).toBeInTheDocument();
        });

        it('deve mostrar erro de network', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));
            renderSeriesDetails();
            await waitFor(() => expect(screen.getByText('Erro ao carregar detalhes da série')).toBeInTheDocument());
        });

        it('deve navegar para página anterior ao clicar em voltar', async () => {
            mockFailedResponse();
            renderSeriesDetails();
            await waitFor(() => fireEvent.click(screen.getByText('Voltar')));
            expect(mockNavigate).toHaveBeenCalledWith(-1);
        });
    });

    describe('Carregamento de dados', () => {
        it('deve carregar e exibir detalhes da série', async () => {
            mockSeriesResponse();
            mockSeasonResponse();
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            expect(screen.getByText('Série')).toBeInTheDocument();
            expect(screen.getByText('2008')).toBeInTheDocument();
            expect(screen.getByText('A high school chemistry teacher turned methamphetamine manufacturer.')).toBeInTheDocument();
            expect(screen.getByText('Crime, Drama, Thriller')).toBeInTheDocument();
            expect(screen.getByText('Bryan Cranston, Aaron Paul, Anna Gunn')).toBeInTheDocument();
            expect(screen.getByText('9.5/10')).toBeInTheDocument();
        });

        it('deve exibir placeholder quando poster é N/A', async () => {
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockSeriesData, poster: 'N/A' }) });
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            expect(screen.getByAltText('Breaking Bad').src).toContain('unsplash.com');
        });

        it('deve carregar temporadas válidas', async () => {
            mockSeriesResponse();
            mockSeasonResponse();
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            await waitFor(() => expect(screen.getByText((content) => content.includes('1 Temporada') && !content.includes('Temporadas'))).toBeInTheDocument());
            expect(screen.getByText('Temporada 1')).toBeInTheDocument();
            expect(screen.getByText('2 episódios • 2008')).toBeInTheDocument();
        });

        it('deve parar busca quando encontra temporada inválida', async () => {
            mockSeriesResponse();
            mockFailedResponse();

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            expect(screen.queryByText('Temporadas')).not.toBeInTheDocument();
        });
    });

    describe('Interação com temporadas', () => {
        beforeEach(async () => {
            mockSeriesResponse();
            mockSeasonResponse();
            mockSeasonResponse([], false);
            renderSeriesDetails();
            await waitFor(() => expect(screen.getByText('Temporada 1')).toBeInTheDocument());
        });

        it('deve expandir temporada ao clicar', async () => {
            fireEvent.click(screen.getByText('Temporada 1'));
            await waitFor(() => expect(screen.getByText('Pilot')).toBeInTheDocument());
            expect(screen.getByText('EP 1')).toBeInTheDocument();
            expect(screen.getByText('Walter White starts cooking meth')).toBeInTheDocument();
            expect(screen.getByText('2008-01-20')).toBeInTheDocument();
            expect(screen.getByText('9.0')).toBeInTheDocument();
        });

        it('deve fechar temporada expandida ao clicar novamente', async () => {
            const seasonButton = screen.getByText('Temporada 1');
            fireEvent.click(seasonButton);
            await waitFor(() => expect(screen.getByText('Pilot')).toBeInTheDocument());
            fireEvent.click(seasonButton);
            await waitFor(() => expect(screen.queryByText('Pilot')).not.toBeInTheDocument());
        });
    });

    describe('Renderização de episódios', () => {
        it('deve renderizar episódios com dados completos', async () => {
            mockSeriesResponse();
            mockSeasonResponse();
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Temporada 1')).toBeInTheDocument());
            fireEvent.click(screen.getByText('Temporada 1'));
            await waitFor(() => expect(screen.getByText('Pilot')).toBeInTheDocument());

            expect(screen.getByText('EP 1')).toBeInTheDocument();
            expect(screen.getByText('EP 2')).toBeInTheDocument();
            expect(screen.getByText('Cat\'s in the Bag...')).toBeInTheDocument();
            expect(screen.getByText('Walter and Jesse face their first crisis')).toBeInTheDocument();
        });

        it('deve renderizar episódios sem título', async () => {
            mockSeriesResponse();
            mockSeasonResponse([{ episode: 1, plot: 'Episode plot', released: '2008-01-20', imdbRating: '9.0' }]);
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Temporada 1')).toBeInTheDocument());
            fireEvent.click(screen.getByText('Temporada 1'));
            await waitFor(() => expect(screen.getByText('Episódio 1')).toBeInTheDocument());
        });
    });

    describe('Funcionalidades adicionais', () => {
        it('deve renderizar botões de ação', async () => {
            mockSeriesResponse();
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            expect(screen.getByText('Assistir')).toBeInTheDocument();
            expect(screen.getByText('Adicionar aos Favoritos')).toBeInTheDocument();
        });

        it('deve renderizar apenas informações disponíveis', async () => {
            fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: '123', title: 'Minimal Series' }) });
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Minimal Series')).toBeInTheDocument());
            expect(screen.queryByText('Sinopse')).not.toBeInTheDocument();
            expect(screen.queryByText('Gênero')).not.toBeInTheDocument();
            expect(screen.queryByText('Elenco')).not.toBeInTheDocument();
            expect(screen.queryByText('Avaliação IMDb')).not.toBeInTheDocument();
        });

        it('deve mostrar singular para uma temporada', async () => {
            mockSeriesResponse();
            mockSeasonResponse();
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            await waitFor(() => expect(screen.getByText((content) => content.includes('1 Temporada') && !content.includes('Temporadas'))).toBeInTheDocument());
        });

        it('deve mostrar plural para múltiplas temporadas', async () => {
            mockSeriesResponse();
            mockSeasonResponse();
            mockSeasonResponse();
            mockSeasonResponse([], false);

            renderSeriesDetails();

            await waitFor(() => expect(screen.getByText('Breaking Bad')).toBeInTheDocument());
            await waitFor(() => expect(screen.getByText((content) => content.includes('2 Temporadas'))).toBeInTheDocument());
        });
    });
});
