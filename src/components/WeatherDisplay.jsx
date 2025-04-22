import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, Wind } from 'lucide-react';

const WeatherDisplay = ({ weatherData, darkMode }) => {
  if (!weatherData) return null;
  
  const getWeatherIcon = () => {
    const condition = weatherData.condition.toLowerCase();
    
    if (condition.includes('clear')) return <Sun size={32} className="text-yellow-400" />;
    if (condition.includes('rain')) return <CloudRain size={32} className="text-blue-400" />;
    if (condition.includes('snow')) return <CloudSnow size={32} className="text-blue-200" />;
    if (condition.includes('cloud')) return <Cloud size={32} className="text-gray-400" />;
    return <Wind size={32} className="text-gray-400" />;
  };
  
  return (
    <div className={`flex items-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <div className="mr-4">
        {getWeatherIcon()}
      </div>
      <div>
        <div className="text-2xl font-bold">{Math.round(weatherData.temperature)}°C</div>
        <div className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          {weatherData.description} in {weatherData.location}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
