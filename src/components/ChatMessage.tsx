import React from 'react';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';
  
  return (
    <div 
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} message-enter message-enter-active`}
    >
      <div 
        className={`flex items-start space-x-2 max-w-[80%] ${
          isBot ? 'text-left' : 'text-right flex-row-reverse space-x-reverse'
        }`}
      >
        <div 
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            isBot ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
          }`}
        >
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        <div 
          className={`py-3 px-4 rounded-2xl ${
            isBot 
              ? 'bg-white border border-gray-200 text-gray-800' 
              : 'bg-red-600 text-white'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.text}</div>
          
          <div 
            className={`text-xs mt-1 ${
              isBot ? 'text-gray-500' : 'text-red-100'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;