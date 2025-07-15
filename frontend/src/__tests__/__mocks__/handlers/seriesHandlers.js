import { http, HttpResponse } from 'msw';
import { mockSeries, mockSeriesDetails, mockSeasonDetails } from '../data/mockSeries';

export const seriesHandlers = [
  http.get('/api/series', ({ request }) => {
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
    
    const filteredSeries = mockSeries.filter(series =>
      series.name.toLowerCase().includes(query.toLowerCase())
    );
    
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    const paginatedResults = filteredSeries.slice(startIndex, endIndex);
    
    return HttpResponse.json({
      results: paginatedResults,
      page,
      total_pages: Math.ceil(filteredSeries.length / 20),
      total_results: filteredSeries.length
    });
  }),

  http.get('/api/series/:id', ({ params }) => {
    const seriesId = parseInt(params.id);
    const series = mockSeriesDetails.find(s => s.id === seriesId);
    
    if (!series) {
      return HttpResponse.json(
        { message: 'Series not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(series);
  }),

  http.get('/api/series/:seriesId/season/:seasonNumber', ({ params }) => {
    const seriesId = parseInt(params.seriesId);
    const seasonNumber = parseInt(params.seasonNumber);
    
    const season = mockSeasonDetails.find(
      s => s.series_id === seriesId && s.season_number === seasonNumber
    );
    
    if (!season) {
      return HttpResponse.json(
        { message: 'Season not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json(season);
  }),

  http.get('/api/series/popular', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    
    return HttpResponse.json({
      results: mockSeries.slice(startIndex, endIndex),
      page,
      total_pages: Math.ceil(mockSeries.length / 20),
      total_results: mockSeries.length
    });
  }),

  http.get('/api/series/error', () => {
    return HttpResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }),
];
