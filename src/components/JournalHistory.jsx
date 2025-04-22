import React, { useState } from 'react';
import { Download, Calendar, Filter } from 'lucide-react';

const moods = [
  { id: 'all', label: 'All Moods' },
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' }
];

const JournalHistory = ({ entries, darkMode, filterMood, setFilterMood, exportEntries }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Filter entries by mood if a filter is selected
  const filteredEntries = filterMood === 'all' 
    ? entries 
    : entries.filter(entry => entry.mood && entry.mood.id === filterMood);
  
  // Group entries by date for calendar view
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateStr = new Date(entry.date).toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(entry);
    return acc;
  }, {});
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Starting from the first day of the week of the first day of the month
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - startDay.getDay());
    
    // Ending at the last day of the week of the last day of the month
    const endDay = new Date(lastDay);
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));
    
    const days = [];
    let currentDay = new Date(startDay);
    
    while (currentDay <= endDay) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  };
  
  // Navigate to previous month
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  return (
    <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Journal History</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className={`p-2 rounded-md ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Calendar size={20} />
          </button>
          <button 
            onClick={exportEntries}
            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Filter controls */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Filter size={16} className="mr-2" />
          <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Filter by mood:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {moods.map(mood => (
            <button
              key={mood.id}
              onClick={() => setFilterMood(mood.id)}
              className={`
                flex items-center px-3 py-1 rounded-full text-sm
                ${filterMood === mood.id 
                  ? (darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800') 
                  : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800')
                }
              `}
            >
              {mood.emoji && <span className="mr-1">{mood.emoji}</span>}
              {mood.label}
            </button>
          ))}
        </div>
      </div>
      
      {viewMode === 'list' ? (
        // List view
        <>
          {filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries.map(entry => (
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
            </div>
          ) : (
            <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No entries found with the selected filter.
            </div>
          )}
        </>
      ) : (
        // Calendar view
        <div>
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={previousMonth}
              className={`p-2 rounded-md ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              &lt;
            </button>
            <h3 className="text-xl font-medium">
              {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h3>
            <button 
              onClick={nextMonth}
              className={`p-2 rounded-md ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              &gt;
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div 
                key={day} 
                className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              const dateStr = day.toISOString().split('T')[0];
              const dayEntries = groupedEntries[dateStr] || [];
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              
              // Filter entries for this day by mood if a filter is selected
              const filteredDayEntries = filterMood === 'all' 
                ? dayEntries 
                : dayEntries.filter(entry => entry.mood && entry.mood.id === filterMood);
              
              return (
                <div 
                  key={index}
                  className={`
                    min-h-20 p-1 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                    ${!isCurrentMonth && (darkMode ? 'bg-gray-900 opacity-50' : 'bg-gray-100 opacity-50')}
                    ${isToday && (darkMode ? 'border-blue-500 border-2' : 'border-blue-500 border-2')}
                  `}
                >
                  <div className="text-right text-sm font-medium mb-1">
                    {day.getDate()}
                  </div>
                  {filteredDayEntries.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {filteredDayEntries.map(entry => (
                        <div 
                          key={entry.id}
                          className="w-full"
                          title={entry.note || 'No note'}
                        >
                          <div className={`
                            p-1 rounded text-center
                            ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}
                          `}>
                            {entry.mood?.emoji || '📝'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalHistory;