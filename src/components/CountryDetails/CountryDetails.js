import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CountryDetails.css';

function CountryDetails() {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { name } = useParams();
  const navigate = useNavigate();

  const fetchCountryDetails = useCallback(async () => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
      if (!response.ok) throw new Error('Country not found');
      const data = await response.json();
      setCountry(data[0]);
      setLoading(false);
    } catch (error) {
      setError('Unable to fetch country details.');
      setLoading(false);
    }
  }, [name]);

  const checkFavoriteStatus = useCallback(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.cca3 === country?.cca3));
  }, [country]);

  useEffect(() => {
    fetchCountryDetails();
  }, [name, fetchCountryDetails]);

  useEffect(() => {
    if (country) {
      checkFavoriteStatus();
    }
  }, [country, checkFavoriteStatus]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.cca3 !== country.cca3);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      if (favorites.length >= 5) {
        alert('Maximum 5 favorites allowed!');
        return;
      }
      favorites.push(country);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('storage'));
  };

  if (loading) return (
    <div className="loadingbox">
      <div className="loadingspin"></div>
      <p>Loading country details...</p>
    </div>
  );

  if (error) return (
    <div className="errorbox glass">
      <div className="erroricon">⚠️</div>
      <h2>Oops!</h2>
      <p>{error}</p>
      <button className="backbtn" onClick={() => navigate('/')}>
        Return Home
      </button>
    </div>
  );

  if (!country) return null;

  return (
    <div className="page-container">
      <div className="detailbox">
        <div className="detailhero" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${country.flags.png})`
        }}>
          <button className="backbtn" onClick={() => navigate('/')}>
            <span>←</span> Back to Countries
          </button>
          
          <div className="titlesection">
            <img src={country.flags.png} alt={`${country.name.common} flag`} className="detailflag"/>
            <div className="titlecontent">
              <h1>{country.name.common}</h1>
              <p className="nativename">
                {Object.values(country.name.nativeName || {})[0]?.common || ''}
              </p>
              <button className={`favbtn ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
                {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        <div className="detailgrid">
          <div className="factcard glass">
            <h3>Quick Facts</h3>
            <div className="factgrid">
              <div className="factitem">
                <span className="facticon">👥</span>
                <div className="factcontent">
                  <label>Population</label>
                  <value>{country.population.toLocaleString()}</value>
                </div>
              </div>
              <div className="factitem">
                <span className="facticon">🌍</span>
                <div className="factcontent">
                  <label>Region</label>
                  <value>{country.region}</value>
                </div>
              </div>
              <div className="factitem">
                <span className="facticon">🏛️</span>
                <div className="factcontent">
                  <label>Capital</label>
                  <value>{country.capital?.[0] || 'N/A'}</value>
                </div>
              </div>
              <div className="factitem">
                <span className="facticon">📏</span>
                <div className="factcontent">
                  <label>Area</label>
                  <value>{country.area.toLocaleString()} km²</value>
                </div>
              </div>
            </div>
          </div>

          <div className="factcard glass">
            <h3>Additional Information</h3>
            <div className="factgrid">
              <div className="factitem">
                <span className="facticon">🗣️</span>
                <div className="factcontent">
                  <label>Languages</label>
                  <value>{Object.values(country.languages || {}).join(', ')}</value>
                </div>
              </div>
              <div className="factitem">
                <span className="facticon">💰</span>
                <div className="factcontent">
                  <label>Currencies</label>
                  <value>
                    {Object.values(country.currencies || {})
                      .map(curr => `${curr.name} (${curr.symbol})`)
                      .join(', ')}
                  </value>
                </div>
              </div>
              <div className="factitem">
                <span className="facticon">🌐</span>
                <div className="factcontent">
                  <label>Domain</label>
                  <value>{country.tld?.[0] || 'N/A'}</value>
                </div>
              </div>
              <div className="factitem">
                <span className="facticon">⚡</span>
                <div className="factcontent">
                  <label>Timezones</label>
                  <value>{country.timezones?.join(', ') || 'N/A'}</value>
                </div>
              </div>
            </div>
          </div>

          {country.borders && (
            <div className="factcard glass">
              <h3>Border Countries</h3>
              <div className="factgrid">
                {country.borders.map(border => (
                  <button key={border} className="factitem">
                    <span className="facticon">🗺️</span>
                    <div className="factcontent">
                      <value>{border}</value>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryDetails;