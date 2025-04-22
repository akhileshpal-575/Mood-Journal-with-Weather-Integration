// App.js - Main application file
import React, { useState, useEffect } from 'react';
import { Calendar, Sun, Moon, CloudRain, Wind, CloudSnow } from 'lucide-react';
import MoodSelector from './components/MoodSelector';
import WeatherDisplay from './components/WeatherDisplay';
import EntryForm from './components/EntryForm';
import JournalHistory from './components/JournalHistory';
import Header from './components/Header';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [view, setView] = useState('entry'); // 'entry' or 'history'
  const [filterMood, setFilterMood] = useState('all');

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    setLoading(false);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('moodEntries', JSON.stringify(entries));
    }
  }, [entries, loading]);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          setError("Failed to get your location. Please enable location services.");
          console.error(err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch weather data when coordinates are available
  useEffect(() => {
    if (coordinates) {
      fetchWeatherData(coordinates);
    }
  }, [coordinates]);

  const fetchWeatherData = async (coords) => {
    try {
      // Using OpenWeatherMap API
      const API_KEY = import.meta.env.VITE_REACT_APP_WEATHER_API_KEY; // Replace with your actual API key in production
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      setWeatherData({
        temperature: data.main.temp,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        location: data.name
      });
    } catch (err) {
      setError("Failed to fetch weather data.");
      console.error(err);
    }
  };

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
  };

  const handleEntrySubmit = (note) => {
    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      mood: currentMood,
      note: note,
      weather: weatherData
    };
    
    setEntries([newEntry, ...entries]);
    setCurrentMood(null);
    
    // Show confirmation message (could be enhanced with a proper notification system)
    alert('Entry saved successfully!');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getMoodBackgroundColor = () => {
    if (!currentMood) return '';
    
    const moodColors = {
      happy: 'bg-yellow-100',
      sad: 'bg-blue-100',
      angry: 'bg-red-200',
      calm: 'bg-green-100',
      anxious: 'bg-purple-200'
    };
    
    return darkMode ? 'bg-gray-900' : moodColors[currentMood.id] || 'bg-white';
  };

  const exportEntries = () => {
    // Create CSV content
    let csvContent = 'Date,Mood,Weather,Temperature,Note\n';
    entries.forEach(entry => {
      const date = new Date(entry.date).toLocaleDateString();
      const mood = entry.mood ? entry.mood.label : 'Not specified';
      const weather = entry.weather ? entry.weather.condition : 'Not recorded';
      const temp = entry.weather ? `${entry.weather.temperature}°C` : 'N/A';
      const note = entry.note || '';
      
      csvContent += `"${date}","${mood}","${weather}","${temp}","${note}"\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'mood_journal_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : getMoodBackgroundColor()}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          view={view}
          setView={setView}
        />
        
        {error && (
          <div className={`p-4 my-4 rounded-lg ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}
        
        {view === 'entry' ? (
          <>
            <div className={`p-6 rounded-lg shadow-lg mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
                <MoodSelector 
                  currentMood={currentMood} 
                  onSelect={handleMoodSelect} 
                  darkMode={darkMode} 
                />
              </div>
              
              {weatherData && (
                <div className="mb-6">
                  <WeatherDisplay weatherData={weatherData} darkMode={darkMode} />
                </div>
              )}
              
              {currentMood && (
                <EntryForm 
                  onSubmit={handleEntrySubmit} 
                  darkMode={darkMode} 
                />
              )}
            </div>
            
            <div className={`mt-8 p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Calendar className="mr-2" size={24} />
                Recent Entries
              </h2>
              {entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.slice(0, 3).map(entry => (
                    <div 
                      key={entry.id} 
                      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">
                          {new Date(entry.date).toLocaleDateString(undefined, { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                        {entry.mood && (
                          <span className="text-2xl">{entry.mood.emoji}</span>
                        )}
                      </div>
                      {entry.weather && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {entry.weather.condition}, {entry.weather.temperature}°C in {entry.weather.location}
                        </div>
                      )}
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {entry.note || 'No note added'}
                      </p>
                    </div>
                  ))}
                  
                  {entries.length > 3 && (
                    <button 
                      onClick={() => setView('history')} 
                      className={`w-full py-2 rounded-lg ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      View all entries
                    </button>
                  )}
                </div>
              ) : (
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  No entries yet. Add your first mood entry above!
                </p>
              )}
            </div>
          </>
        ) : (
          <JournalHistory 
            entries={entries} 
            darkMode={darkMode} 
            filterMood={filterMood}
            setFilterMood={setFilterMood}
            exportEntries={exportEntries}
          />
        )}
      </div>
    </div>
  );
}

export default App;