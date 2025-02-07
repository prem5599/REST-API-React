import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(storedFavorites);
    };

    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <nav className="navbarbox">
      <div className="navwrap">
        <Link to="/" className="navlogo">
          <span className="logotext">World Stats</span>
        </Link>
        
        <div className="navlinks">
          <Link to="/" className="navlink">
            Home
          </Link>
          <Link to="/favorites" className="favbtn">
            <span>⭐</span>
            Favorites
            <span className="favcount">{favorites.length}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;