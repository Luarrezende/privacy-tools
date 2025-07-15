import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import MovieDetails from '../pages/MovieDetails/MovieDetails';
import SeriesDetails from '../pages/SeriesDetails/SeriesDetails';
import SeasonDetails from '../pages/SeasonDetails/SeasonDetails';
import EpisodeDetails from '../pages/EpisodeDetails/EpisodeDetails';
import NotFound from '../pages/NotFound/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <SearchProvider>
        <MainLayout>
          <Routes>
            {/* Página principal - onde aparece busca e resultados */}
            <Route path="/" element={<Home />} />
            
            {/* Detalhes dos filmes */}
            <Route path="/movies/:id" element={<MovieDetails />} />
            
            {/* Detalhes das séries - hierárquico */}
            <Route path="/series/:id" element={<SeriesDetails />} />
            <Route path="/series/:id/season/:seasonNumber" element={<SeasonDetails />} />
            <Route path="/series/:id/season/:seasonNumber/episode/:episodeNumber" element={<EpisodeDetails />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </SearchProvider>
    </BrowserRouter>
  );
};

export default AppRouter;
