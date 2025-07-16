import { http, HttpResponse } from 'msw';
import { mockMovies, mockMovieDetails } from '../data/mockMovies';

export const movieHandlers = [
  // GET movies - busca de filmes
  http.get('/api/movies', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    const page = parseInt(url.searchParams.get('page')) || 1;
    
    if (!query) {
      return HttpResponse.json({
        results: [],
        page: 1,
        total_pages: 0,
        total_results: 0
      });
    }
    
    const filteredMovies = mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    const paginatedResults = filteredMovies.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      results: paginatedResults,
      page,
      total_pages: Math.ceil(filteredMovies.length / 20),
      total_results: filteredMovies.length
    });
  }),

  // GET movie details
  http.get('/api/movies/:id', ({ params }) => {
    const movieId = parseInt(params.id);
    const movie = mockMovieDetails.find(m => m.id === movieId);
    
    if (!movie) {
      return HttpResponse.json(
        { message: 'Movie not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(movie);
  }),

  // GET popular movies
  http.get('/api/movies/popular', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    
    return HttpResponse.json({
      results: mockMovies.slice(startIndex, endIndex),
      page,
      total_pages: Math.ceil(mockMovies.length / 20),
      total_results: mockMovies.length
    });
  }),

  http.get('/api/movies/error', () => {
    return HttpResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }),
];
