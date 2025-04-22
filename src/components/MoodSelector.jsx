import React from 'react';

const moods = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'angry', label: 'Angry', emoji: '😠' },
  { id: 'calm', label: 'Calm', emoji: '😌' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' }
];

const MoodSelector = ({ currentMood, onSelect, darkMode }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {moods.map(mood => (
        <button
          key={mood.id}
          onClick={() => onSelect(mood)}
          className={`
            flex flex-col items-center p-4 rounded-lg transition-all duration-300
            ${currentMood && currentMood.id === mood.id 
              ? (darkMode ? 'bg-blue-700 scale-110' : 'bg-blue-100 scale-110') 
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200')
            }
          `}
        >
          <span className="text-4xl mb-2">{mood.emoji}</span>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MoodSelector;
