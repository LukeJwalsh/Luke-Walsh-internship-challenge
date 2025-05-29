import { useState, useEffect, useRef } from "react";
import type { CryptoStats } from "../types/types";
import './app.css';
import CryptoChart from "./components/CryptoChart";

function App() {
  // State for the input query
  const [query, setQuery] = useState<string>("");

  // Stores current crypto data including stats and historical prices
  const [crypto, setCrypto] = useState<CryptoStats | null>(null);

  // Error message for display if anything fails
  const [error, setError] = useState<string | null>(null);

  // Number of days selected for chart history (1, 7, or 30)
  const [days, setDays] = useState<number>(7);

  // stores previously fetched data by coin ID and day range
  const cacheRef = useRef<Record<string, Record<number, CryptoStats>>>({});

  // Fetches crypto data from backend (includes price + historical chart data)
  const handleSearch = async () => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return;

    // Clear previous result
    setError(null);
    setCrypto(null); 

    try {
      const res = await fetch(`http://localhost:8000/crypto?query=${trimmedQuery}&days=${days}`);
      const data = await res.json();

      // Handle backend errors like API rate limits
      if (!res.ok) {
        if (data.detail === "Failed to fetch historical price data") {
          setError("API rate limit exceeded. Please wait and try again.");
        } else {
          setError(data.detail || "Something went wrong. Try again later.");
        }
        return;
      }

      // Store fetched data in cache for reuse
      const coinId = data.id;
      if (!cacheRef.current[coinId]) {
        cacheRef.current[coinId] = {};
      }
      cacheRef.current[coinId][days] = data;

      setCrypto(data); 
    } catch (err) {
      console.error(err);
      setError("Could not connect to the server. Please try again later.");
    }
  };

  // Runs when the user changes the time range (1D/7D/30D)
  const updateChartForNewDays = async () => {
    if (!crypto) return;

    const cached = cacheRef.current[crypto.id]?.[days];
    if (cached) {
      // Use cached if available
      setCrypto(cached); 
    } else {
      // Otherwise re-fetch
      await handleSearch(); 
    }
  };

  // Triggers updateChartForNewDays() when days changes
  useEffect(() => {
    updateChartForNewDays();
  }, [days]);

  return (
    <div className="app-container">
      <h1 className="search-heading">Crypto Dashboard</h1>

      {/* Search Box */}
      <div className="search-wrapper">
        <div className="search-group">
          <input
            type="text"
            className="input-box"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter crypto name or symbol"
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>

        {/* Time Range Buttons (1D, 7D, 30D) */}
        <div className="mt-6 flex justify-center space-x-2">
          {[{ label: "1D", value: 1 }, { label: "7D", value: 7 }, { label: "30D", value: 30 }].map(
            ({ label, value }) => (
              <button
                key={value}
                onClick={() => setDays(value)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  days === value
                    ? "bg-yellow-400 text-white shadow"
                    : "bg-gray-800 text-white border border-gray-700 rounded-1 hover:bg-yellow-500 transition"
                }`}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Show Error Message if Any */}
      {error && <p className="error-text">{error}</p>}

      {/* Display Chart */}
      {crypto && (
        <>
          {/* Chart Component */}
          <CryptoChart
            history={crypto.history}
            name={crypto.name}
            symbol={crypto.symbol}
            currentPrice={crypto.price_usd}
            days={days}
          />
        </>
      )}
    </div>
  );
}

export default App;
