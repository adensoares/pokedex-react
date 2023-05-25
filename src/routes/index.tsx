import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import PokemonDetails from '../pages/PokemonDetails/PokemonDetails';
import Header from '../components/Header/Header';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
        <Header />
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
        </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
