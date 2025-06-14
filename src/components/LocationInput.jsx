import React, { useState, useEffect } from 'react';

const LocationInput = ({ placeholder, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (query.length > 2) {
      const proxyUrl = 'https://corsproxy.io/?';
      const targetUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

      fetch(proxyUrl + targetUrl)
        .then((res) => res.json())
        .then((data) => setResults(data.slice(0, 5)))
        .catch(() => setResults([]));
    } else {
      setResults([]);
    }
  }, 400);
  return () => clearTimeout(timeoutId);
}, [query]);


  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
      />
      {showDropdown && results.length > 0 && (
        <ul className="absolute z-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 w-full mt-1 rounded shadow text-sm max-h-60 overflow-auto">
          {results.map((place, idx) => (
            <li
              key={idx}
              className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => {
                setQuery(place.display_name);
                setShowDropdown(false);
                onSelect([parseFloat(place.lat), parseFloat(place.lon)]);
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
