import React from 'react';
import { Sun, Moon, Calendar, PenTool } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode, view, setView }) => {
  const today = new Date().toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mood Journal</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setView(view === 'entry' ? 'history' : 'entry')} 
            className={`p-2 rounded-full ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label={view === 'entry' ? 'View history' : 'New entry'}
          >
            {view === 'entry' ? <Calendar size={20} /> : <PenTool size={20} />}
          </button>
        </div>
      </div>
      <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Today is {today}
      </div>
    </header>
  );
};

export default Header;