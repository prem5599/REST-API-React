// Filters.js
import React, { useState, useEffect } from 'react';
import './Filters.css';

function Filters({ onFilter, countries = [] }) {
 const [regions, setRegions] = useState([]);
 const [languages, setLanguages] = useState([]);
 const [activeRegion, setActiveRegion] = useState('');
 const [activeLanguage, setActiveLanguage] = useState('');
 
 useEffect(() => {
   if (countries.length > 0) {
     const uniqueRegions = [...new Set(
       countries
         .map(country => country.region)
         .filter(region => region)
     )].sort();

     const languageSet = new Set();
     countries.forEach(country => {
       if (country.languages) {
         Object.values(country.languages).forEach(lang => {
           if (lang) languageSet.add(lang);
         });
       }
     });

     setRegions(uniqueRegions);
     setLanguages([...languageSet].sort());
   }
 }, [countries]);

 const handleFilterChange = (type, value) => {
   if (type === 'region') {
     setActiveRegion(value);
     setActiveLanguage('');
     if (value === '') {
       onFilter({ type: null, value: null });
     } else {
       onFilter({ type, value });
     }
   } else if (type === 'language') {
     setActiveLanguage(value);
     setActiveRegion('');
     if (value === '') {
       onFilter({ type: null, value: null });
     } else {
       onFilter({ type, value });
     }
   }
 };

 return (
   <div className="filterbox">
     <div className="filterheader">
       <h2>Filter Countries</h2>
     </div>

     <div className="filtergrid">
       <div className="filtergroup">
         <label className="filterlabel">
           <span className="filtericon">🌎</span>
           Region
         </label>
         <select
           value={activeRegion}
           onChange={(e) => handleFilterChange('region', e.target.value)}
           className="filterselect"
           aria-label="Select Region"
         >
           <option value="">All Regions</option>
           {regions.map(region => (
             <option key={region} value={region}>
               {region}
             </option>
           ))}
         </select>
       </div>

       <div className="filtergroup">
         <label className="filterlabel">
           <span className="filtericon">🗣️</span>
           Language
         </label>
         <select
           value={activeLanguage}
           onChange={(e) => handleFilterChange('language', e.target.value)}
           className="filterselect"
           aria-label="Select Language"
         >
           <option value="">All Languages</option>
           {languages.map(language => (
             <option key={language} value={language}>
               {language}
             </option>
           ))}
         </select>
       </div>
     </div>
   </div>
 );
}

export default Filters;