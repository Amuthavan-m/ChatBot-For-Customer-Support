import React from 'react';
import ChatbotContainer from './components/ChatbotContainer';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <header className="bg-red-600 py-4 px-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">🎬</span> MovieMate Ticket Booking
          </h1>
        </header>
        <ChatbotContainer />
      </div>
    </div>
  );
}

export default App;