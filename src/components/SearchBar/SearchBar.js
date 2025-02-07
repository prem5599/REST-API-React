import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar({ onSearch, countries }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    setShowSuggestions(false);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClose]);

  const selectCountry = useCallback((country, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!country?.name?.common) return;

    navigate(`/country/${encodeURIComponent(country.name.common)}`);
    setQuery('');
    onSearch('');
    handleClose();
  }, [navigate, onSearch, handleClose]);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);

    if (value.trim()) {
      const filtered = countries?.filter(country => 
        country?.name?.common?.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5) || [];
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      handleClose();
    }
  }, [countries, onSearch, handleClose]);

  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions) return;

    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectCountry(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        handleClose();
        break;
      default:
        break;
    }
  }, [showSuggestions, suggestions, selectedIndex, selectCountry, handleClose]);

  return (
    <div className="searchbox" ref={searchRef}>
      <div className="searchwrap">
        <svg className="searchicon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          placeholder="Search for any country..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="searchinput"
        />

        {query && (
          <button 
            className="searchbtn"
            onClick={() => {
              setQuery('');
              onSearch('');
              handleClose();
            }}
          >
            ×
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="searchlist">
          {suggestions.map((country, index) => (
            <div
              key={country.cca1}
              className={`listitem ${index === selectedIndex ? 'selected' : ''}`}
              onClick={(e) => selectCountry(country, e)}
              onMouseEnter={() => setSelectedIndex(index)}
              role="button"
              tabIndex={0}
            >
              <img
                src={country.flags.png}
                alt={`${country.name.common} flag`}
                className="listflag"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-flag.png';
                }}
              />
              <div className="listbox">
                <span className="listname">{country.name.common}</span>
                <span className="listregion">{country.region}</span>
              </div>
              <div className="listpop">
                {country.population > 0 
                  ? `${(country.population / 1000000).toFixed(1)}M`
                  : 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;