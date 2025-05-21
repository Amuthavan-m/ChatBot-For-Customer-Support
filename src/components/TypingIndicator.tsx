import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start space-x-2 max-w-[80%]">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4m0 4a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 4a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 4v-4"/>
        </svg>
      </div>
      <div className="py-3 px-4 rounded-2xl bg-white border border-gray-200">
        <div className="typing-indicator py-2">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;