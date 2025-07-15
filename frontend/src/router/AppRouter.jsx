import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { NotificationProvider } from '../context/NotificationContext';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Favorites from '../pages/Favorites/Favorites';
import MovieDetails from '../pages/MovieDetails/MovieDetails';
import SeriesDetails from '../pages/SeriesDetails/SeriesDetails';
import NotFound from '../pages/NotFound/NotFound';
import NotificationContainer from '../components/ui/NotificationContainer/NotificationContainer';

const AppRouter = () => {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <FavoritesProvider>
          <SearchProvider>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/movies/:id" element={<MovieDetails />} />
                <Route path="/series/:id" element={<SeriesDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </SearchProvider>
        </FavoritesProvider>
        <NotificationContainer />
      </BrowserRouter>
    </NotificationProvider>
  );
};

export default AppRouter;
