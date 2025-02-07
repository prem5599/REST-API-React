import React, { useState, useEffect } from 'react';
import './FavoritesList.css';

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
    
    const handleStorageChange = (e) => {
      if (e.key === 'favorites') {
        loadFavorites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const removeFavorite = (e, countryToRemove) => {
    e.stopPropagation();
    const updatedFavorites = favorites.filter(country => country.cca3 !== countryToRemove.cca3);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(updatedFavorites);
  };

  if (isLoading) {
    return <div className="loader"></div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <div className="heart-icon"></div>
        <h2>Your Favorites</h2>
        <p>Start exploring and add your favorite countries!</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>Your Favorite Countries <span>({favorites.length}/5)</span></h2>
      </div>
      
      <div className="favorites-grid">
        {favorites.map((country) => (
          <div key={country.cca3} className="favorite-card">
            <div className="flag-container">
              <img 
                src={country.flags.png} 
                alt={`${country.name.common} flag`}
                className="country-flag"
              />
              <button
                onClick={(e) => removeFavorite(e, country)}
                className="remove-btn"
                aria-label="Remove from favorites"
              >
                <span className="remove-icon">×</span>
              </button>
              <div className="overlay"></div>
            </div>
            
            <div className="country-info">
              <h3>{country.name.common}</h3>
              
              <div className="country-details">
                <div className="detail-item">
                  <span className="detail-icon population-icon"></span>
                  <span>{country.population.toLocaleString()}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-icon region-icon"></span>
                  <span>{country.region}</span>
                </div>
                
                {country.capital && (
                  <div className="detail-item">
                    <span className="detail-icon capital-icon"></span>
                    <span>{country.capital[0]}</span>
                  </div>
                )}
                
                <div className="languages">
                  {Object.values(country.languages || {}).map((language, index) => (
                    <span key={index} className="language-tag">
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;