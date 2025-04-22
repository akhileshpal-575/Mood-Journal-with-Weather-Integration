import React, { useState } from 'react';

const EntryForm = ({ onSubmit, darkMode }) => {
  const [note, setNote] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(note.trim());
    setNote('');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label 
          htmlFor="note" 
          className={`block mb-2 font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
        >
          Add a note (optional)
        </label>
        <textarea
          id="note"
          rows="4"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          placeholder="What's on your mind today?"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Save Entry
      </button>
    </form>
  );
};

export default EntryForm;
