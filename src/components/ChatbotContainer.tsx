import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import { processMessage } from '../services/nlpService';
import { Message, BotAction } from '../types';

const ChatbotContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [currentAction, setCurrentAction] = useState<BotAction | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Show welcome message on load
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: "👋 Welcome to MovieMate! I'm your virtual booking assistant. What movie would you like to watch today?",
      sender: 'bot',
      timestamp: new Date()
    };
    const timer = setTimeout(() => setMessages([welcomeMessage]), 500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll chat to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await processMessage(text, messages, currentAction);

      // Simulate typing based on response length (more natural)
      const delay = Math.min(3000, 500 + response.message.length * 20);
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          text: response.message,
          sender: 'bot',
          timestamp: new Date(),
          action: response.action
        };

        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        if (response.action) setCurrentAction(response.action);
      }, delay);

    } catch (err) {
      console.error('NLP processing failed:', err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: "⚠️ Sorry, I had trouble understanding that. Could you rephrase?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ChatWindow 
        messages={messages} 
        isTyping={isTyping} 
        messagesEndRef={messagesEndRef}
        currentAction={currentAction}
        onActionComplete={(updatedAction) => setCurrentAction(updatedAction)}
        onActionResponse={handleSendMessage}
      />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatbotContainer;
