import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import CountryList from './components/CountryList/CountryList';
import CountryDetails from './components/CountryDetails/CountryDetails';
import FavoritesList from './components/FavoritesList/FavoritesList';
import './App.css';

function App() {
  return (
    <Router basename="/">
      <div className="appwrapper">
        <div className="bgeffects">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
          <div className="orb orb3"></div>
        </div>

        <Navbar />
        
        <main className="mainwrap">
          <div className="contentwrap glasseffect">
            <Routes>
              <Route exact path="/" element={<CountryList />} />
              <Route path="/country/:name" element={<CountryDetails />} />
              <Route path="/favorites" element={<FavoritesList />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;