import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import Filters from '../Filters/Filters';
import './CountryList.css';
import country from '../../images/Country.png';
import region from '../../images/Region.png';
import language from '../../images/Language.svg';
import population from '../../images/Population.svg';

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState({ type: null, value: null });
  const [stats, setStats] = useState({
    totalCountries: 0,
    totalPopulation: 0,
    totalLanguages: 0,
    totalRegions: 0
  });
  const navigate = useNavigate();

  const calculateStats = useCallback((data) => {
    const languages = new Set();
    const regions = new Set();
    let totalPopulation = 0;

    data.forEach(country => {
      totalPopulation += country.population || 0;
      if (country.languages) {
        Object.values(country.languages).forEach(lang => languages.add(lang));
      }
      if (country.region) regions.add(country.region);
    });

    setStats({
      totalCountries: data.length,
      totalPopulation,
      totalLanguages: languages.size,
      totalRegions: regions.size
    });
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setCountries(data);
      setFilteredCountries(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    if (!countries.length) return;

    let result = [...countries];

    if (searchQuery) {
      result = result.filter(country => 
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeFilter.type && activeFilter.value) {
      result = result.filter(country => {
        if (activeFilter.type === 'region') {
          return country.region === activeFilter.value;
        } else if (activeFilter.type === 'language') {
          return country.languages && 
                 Object.values(country.languages)
                   .some(lang => lang === activeFilter.value);
        }
        return true;
      });
    }

    setFilteredCountries(result);
  }, [countries, searchQuery, activeFilter]);

  return (
    <div className="listcontainer">
      {/* Rest of the JSX remains the same */}
      <section className="listhero">
        <div className="herocontent">
          <h1 className="herotitle">
            <span className="gradientxt">Explore</span> Our World
          </h1>
          <p className="heropara">
            Discover fascinating details about countries around the globe
          </p>
          <SearchBar onSearch={setSearchQuery} countries={countries} />
          
          <div className="heroanimation">
            <div className="globeanim"></div>
            <div className="gloweffect"></div>
          </div>
        </div>
        
        <div className="statgrid">
          <div className="statbox glass">
            <div className="staticon">
              <img src={country} alt="country"/>
            </div>
            <div className="statinfo">
              <h3>{stats.totalCountries.toLocaleString()}</h3>
              <p>Countries</p>
            </div>
          </div>
          <div className="statbox glass">
            <div className="staticon">
              <img src={population} />
            </div>
            <div className="statinfo">
              <h3>{(stats.totalPopulation / 1000000000).toFixed(1)}B</h3>
              <p>Global Population</p>
            </div>
          </div>
          <div className="statbox glass">
            <div className="staticon">
              <img src={language} alt="global language"/>
            </div>
            <div className="statinfo">
              <h3>{stats.totalLanguages.toLocaleString()}</h3>
              <p>Languages</p>
            </div>
          </div>
          <div className="statbox glass">
            <div className="staticon">
              <img src={region} alt="total region in the world"/>
            </div>
            <div className="statinfo">
              <h3>{stats.totalRegions}</h3>
              <p>Regions</p>
            </div>
          </div>
        </div>
      </section>

      <main className="listmain">
        <div className="filtersection glass">
          <Filters 
            onFilter={setActiveFilter} 
            countries={countries}
          />
        </div>

        <div className="cardgrid">
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="countrybox skeleton"></div>
            ))
          ) : filteredCountries.length > 0 ? (
            filteredCountries.map(country => (
              <div
                key={country.cca3}
                className="countrybox glass"
                onClick={() => navigate(`/country/${country.name.common}`)}
              >
                <div className="flagbox">
                  <img
                    src={country.flags.png}
                    alt={`${country.name.common} flag`}
                    loading="lazy"
                  />
                </div>
                <div className="countryinfo">
                  <h3>{country.name.common}</h3>
                  <div className="countrystats">
                    <div className="statitem">
                      <span className="statlabel">Population</span>
                      <span className="statvalue">
                        {(country.population / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="statitem">
                      <span className="statlabel">Region</span>
                      <span className="statvalue">{country.region}</span>
                    </div>
                  </div>
                  <button className="explorebtn">
                    Explore
                    <span className="btnarrow">→</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="noresults">No countries found matching your criteria</div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CountryList;