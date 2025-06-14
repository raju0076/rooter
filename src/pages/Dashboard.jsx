// src/MapPage.jsx
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import SignOutButton from "./SignOutButton";

function RoutingMachine({ startPoint, endPoint, setDistance }) {
  const map = useMap();

  useEffect(() => {
    if (!startPoint || !endPoint) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(startPoint.lat, startPoint.lng),
        L.latLng(endPoint.lat, endPoint.lng)
      ],
      routeWhileDragging: true,
      show: false,
      addWaypoints: false
    }).addTo(map);

    routingControl.on("routesfound", function (e) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const distanceInKm = routes[0].summary.totalDistance / 1000;
        setDistance(distanceInKm.toFixed(2));
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [startPoint, endPoint, map, setDistance]);

  return null;
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    }
  });
  return null;
}

function MapPage({ setIsAuthenticated }) {
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [distance, setDistance] = useState(null);
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [suggestionsStart, setSuggestionsStart] = useState([]);
  const [suggestionsEnd, setSuggestionsEnd] = useState([]);

  // Fetch location suggestions from Nominatim
  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching suggestions: ", error);
      return [];
    }
  };

  const handleStartInputChange = async (e) => {
    const query = e.target.value;
    setSearchStart(query);
    if (query.length > 2) {
      const suggestions = await fetchSuggestions(query);
      setSuggestionsStart(suggestions);
    } else {
      setSuggestionsStart([]);
    }
  };

  const handleEndInputChange = async (e) => {
    const query = e.target.value;
    setSearchEnd(query);
    if (query.length > 2) {
      const suggestions = await fetchSuggestions(query);
      setSuggestionsEnd(suggestions);
    } else {
      setSuggestionsEnd([]);
    }
  };

  const handleSelectStartSuggestion = (suggestion) => {
    setSearchStart(suggestion.display_name);
    setStartPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setSuggestionsStart([]);
  };

  const handleSelectEndSuggestion = (suggestion) => {
    setSearchEnd(suggestion.display_name);
    setEndPoint({ lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) });
    setSuggestionsEnd([]);
  };

  const handleMapClick = (latlng) => {
    if (!startPoint) {
      setStartPoint(latlng);
    } else if (!endPoint) {
      setEndPoint(latlng);
    }
  };

  const resetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setDistance(null);
    setSearchStart("");
    setSearchEnd("");
    setSuggestionsStart([]);
    setSuggestionsEnd([]);
  };

  // Get the current location for start point
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartPoint({ lat: latitude, lng: longitude });
          setSearchStart("Current Location");
          setSuggestionsStart([]);
        },
        (error) => {
          console.error("Error obtaining geolocation: ", error);
          toast.error("Unable to retrieve your current location. Please try again.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-wide">Routing App</h1>
        <SignOutButton setIsAuthenticated={setIsAuthenticated} />
      </header>

      <main className="flex flex-col md:flex-row p-6">
        {/* Sidebar */}
        <aside className="md:w-80 bg-white rounded-xl shadow-xl p-6 mb-6 md:mb-0 md:mr-6 mt-7">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold mb-2">Start Point:</label>
              <input
                type="text"
                value={searchStart}
                onChange={handleStartInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter start location"
              />
              <div className="flex mt-3 space-x-2">
                <button
                  onClick={async () => {
                    const result = await fetchSuggestions(searchStart);
                    if (result.length > 0) handleSelectStartSuggestion(result[0]);
                  }}
                  className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-300"
                >
                  Search
                </button>
                <button
                  onClick={handleUseCurrentLocation}
                  className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300"
                >
                  My Location
                </button>
              </div>
              {suggestionsStart.length > 0 && (
                <ul className="mt-3 border rounded-lg bg-white shadow-md">
                  {suggestionsStart.map((s, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectStartSuggestion(s)}
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">End Point:</label>
              <input
                type="text"
                value={searchEnd}
                onChange={handleEndInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter destination"
              />
              <button
                onClick={async () => {
                  const result = await fetchSuggestions(searchEnd);
                  if (result.length > 0) handleSelectEndSuggestion(result[0]);
                }}
                className="mt-3 w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all duration-300"
              >
                Search
              </button>
              {suggestionsEnd.length > 0 && (
                <ul className="mt-3 border rounded-lg bg-white shadow-md">
                  {suggestionsEnd.map((s, i) => (
                    <li
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectEndSuggestion(s)}
                    >
                      {s.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={resetPoints}
              className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-all duration-300"
            >
              Reset Points
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-700">
            {startPoint && (
              <p>
                <strong>Start:</strong> {startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)}
              </p>
            )}
            {endPoint && (
              <p>
                <strong>End:</strong> {endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)}
              </p>
            )}
            {distance && (
              <p>
                <strong>Distance:</strong> {distance} km
              </p>
            )}
          </div>
        </aside>

        {/* Map */}
        <section className="flex-1 rounded-xl shadow-xl overflow-hidden mt-7">
          <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-[85vh] w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {startPoint && <Marker position={startPoint} />}
            {endPoint && <Marker position={endPoint} />}
            <ClickHandler onMapClick={handleMapClick} />
            {startPoint && endPoint && (
              <RoutingMachine startPoint={startPoint} endPoint={endPoint} setDistance={setDistance} />
            )}
          </MapContainer>
        </section>
      </main>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default MapPage;
