import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function FacilitySearch() {
  const sports = ['Badminton', 'Basketball', 'Street Soccer', 'Sepak Takraw'];
  const [sportIndex, setSportIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courts, setCourts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSportIndex((prev) => (prev + 1) % sports.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(`${API_BASE_URL}/api/courts`, {
            params: { lat: latitude, lng: longitude },
          });
          setCourts(res.data);
        } catch (err) {
          setError("Failed to fetch courts.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <p className="flex flex-col text-5xl font-semibold mb-8">
        Search <span className="text-blue-600">{sports[sportIndex]}</span> Courts in SG
      </p>
      <button
        onClick={handleSearch}
        className="w-full flex items-center justify-start px-4 py-2 border rounded shadow text-left bg-white hover:bg-gray-100"
      >
        <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
        </svg>
        <span className="text-gray-600">Input location...</span>
      </button>

      {loading && <p className="mt-4 text-sm text-blue-500">Fetching nearby courts...</p>}
      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <ul className="mt-4 space-y-3">
        {courts.map((court) => (
          <li key={court.id} className="border rounded p-3 shadow-sm">
            <p className="font-medium">{court.name} 100m away</p>
            <p className="text-sm text-gray-500">{court.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}