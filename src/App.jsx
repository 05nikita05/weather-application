import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css'; // For additional custom styles

const App = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // Track selected day

  const API_KEY = "221a8418b41846ad80d195258241210";

  const getWeather = async (e) => {
    e.preventDefault();
    try {
      const currentWeatherResponse = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );
      setWeather(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=4`
      );
      setForecast(forecastResponse.data.forecast.forecastday);
      setSelectedDay(null); // Reset selected day on new search
    } catch (err) {
      console.error("City not found", err);
    }
  };

  const getBackgroundStyle = () => {
    if (!weather) return 'bg-gradient-to-b from-gray-900 to-gray-700';
    const condition = weather.current.condition.text.toLowerCase();
    if (condition.includes('sunny')) return 'bg-gradient-to-b from-yellow-300 to-orange-600';
    if (condition.includes('rain')) return 'bg-gradient-to-b from-gray-400 to-blue-800';
    if (condition.includes('cloud')) return 'bg-gradient-to-b from-gray-500 to-gray-700';
    return 'bg-gradient-to-b from-blue-900 to-blue-600';
  };

  const getCardColorStyle = (condition) => {
    if (condition.includes('sunny')) return 'bg-yellow-400/90';
    if (condition.includes('rain')) return 'bg-blue-800/90';
    if (condition.includes('cloud')) return 'bg-gray-700/90';
    return 'bg-blue-600/90';
  };

  return (
    <div className={`${getBackgroundStyle()} min-h-screen flex flex-col items-center justify-center text-white p-4`}>
      <h1 className="text-4xl font-bold mb-8 text-center">Weather Forecast App</h1>

      {/* Search Input */}
      <form onSubmit={getWeather} className="flex w-full max-w-lg shadow-lg">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-grow p-3 rounded-l-lg border-none outline-none text-black"
        />
        <button type="submit" className="px-6 bg-blue-700 rounded-r-lg font-semibold">Search</button>
      </form>

      {/* Current or Selected Day Weather */}
      <AnimatePresence>
        {(weather && !selectedDay) && (
          <motion.div
            key="currentWeather"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="mt-10 w-full max-w-md bg-opacity-90 rounded-2xl p-6 shadow-lg"
            style={{ backgroundColor: getCardColorStyle(weather.current.condition.text.toLowerCase()) }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-5xl font-bold">{weather.current.temp_c}°C</h2>
                <p className="text-xl font-medium">{weather.location.name}</p>
                <p className="text-md text-gray-200">{new Date().toLocaleDateString()}</p>
              </div>
              <motion.img
                src={weather.current.condition.icon}
                alt="weather icon"
                className="w-20 h-20"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
              />
            </div>
            <div className="flex justify-between text-gray-200 mt-6">
              <div className="text-center">
                <p className="text-lg">{weather.current.wind_kph} km/h</p>
                <p className="text-sm">Wind</p>
              </div>
              <div className="text-center">
                <p className="text-lg">{weather.current.humidity}%</p>
                <p className="text-sm">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-lg">{weather.current.cloud}%</p>
                <p className="text-sm">Cloudiness</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 3-Day Forecast Cards */}
        {forecast && !selectedDay && (
          <div className="mt-8 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Next 2 Days</h3>
            <div className="flex gap-4">
              {forecast.slice(1, 4).map((day, index) => (
                <motion.div
                  key={index}
                  className={`flex-1 p-4 rounded-lg shadow-lg text-center cursor-pointer`}
                  onClick={() => setSelectedDay(day)} // Set selected day
                  whileHover={{ scale: 1.05 }}
                  style={{ backgroundColor: getCardColorStyle(day.day.condition.text.toLowerCase()) }}
                >
                  <p className="text-lg font-semibold">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </p>
                  <img src={day.day.condition.icon} alt="weather icon" className="w-14 h-14 mx-auto" />
                  <p className="text-lg mt-2">{day.day.avgtemp_c}°C</p>
                  <p className="text-sm text-gray-300">{day.day.condition.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Day Detailed View */}
        {selectedDay && (
          <motion.div
            key="selectedDay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="mt-10 w-full max-w-md bg-opacity-90 rounded-2xl p-6 shadow-lg"
            style={{ backgroundColor: getCardColorStyle(selectedDay.day.condition.text.toLowerCase()) }}
          >
            <button
              onClick={() => setSelectedDay(null)} // Go back to today
              className="text-sm bg-blue-700 px-4 py-2 rounded-lg mb-4"
            >
              Back to Today
            </button>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-5xl font-bold">{selectedDay.day.avgtemp_c}°C</h2>
                <p className="text-xl font-medium">{new Date(selectedDay.date).toLocaleDateString()}</p>
                <p className="text-md text-gray-200">{selectedDay.day.condition.text}</p>
              </div>
              <img src={selectedDay.day.condition.icon} alt="weather icon" className="w-20 h-20" />
            </div>
            <div className="flex justify-between text-gray-200 mt-6">
              <div className="text-center">
                <p className="text-lg">{selectedDay.day.maxwind_kph} km/h</p>
                <p className="text-sm">Max Wind</p>
              </div>
              <div className="text-center">
                <p className="text-lg">{selectedDay.day.avghumidity}%</p>
                <p className="text-sm">Humidity</p>
              </div>
              <div className="text-center">
                <p className="text-lg">{selectedDay.day.daily_chance_of_rain}%</p>
                <p className="text-sm">Rain Chance</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
