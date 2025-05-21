import React from 'react';
import ChatMessage from './ChatMessage';
import TheatreSelector from './TheatreSelector';
import SeatSelector from './SeatSelector';
import PaymentForm from './PaymentForm';
import TicketDisplay from './TicketDisplay';
import TypingIndicator from './TypingIndicator';
import { Message, BotAction } from '../types';

interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentAction: BotAction | null;
  onActionComplete: (updatedAction: BotAction | null) => void;
  onActionResponse: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isTyping,
  messagesEndRef,
  currentAction,
  onActionComplete,
  onActionResponse
}) => {
  const renderActionComponent = () => {
    if (!currentAction) return null;

    switch (currentAction.type) {
      case 'selectTheatre':
        return (
          <TheatreSelector
            theatres={currentAction.data.theatres}
            onSelect={(theatre) => {
              onActionComplete({
                ...currentAction,
                data: { ...currentAction.data, selectedTheatre: theatre }
              });
              onActionResponse(`I'd like to book at ${theatre.name}`);
            }}
          />
        );
      case 'selectSeats':
        return (
          <SeatSelector
            seats={currentAction.data.seats}
            selectedSeats={currentAction.data.selectedSeats || []}
            onSelect={(selectedSeats) => {
              onActionComplete({
                ...currentAction,
                data: { ...currentAction.data, selectedSeats }
              });
              onActionResponse(`I'd like to book seats ${selectedSeats.map(s => s.code).join(', ')}`);
            }}
          />
        );
      case 'payment':
        return (
          <PaymentForm
            onSubmit={(customerData) => {
              onActionComplete({
                ...currentAction,
                data: { ...currentAction.data, customerData }
              });
              onActionResponse('I\'ve completed the payment form');
            }}
          />
        );
      case 'ticket':
        return (
          <TicketDisplay
            ticketData={currentAction.data}
            onClose={() => {
              onActionComplete(null);
              onActionResponse('Thanks for my ticket!');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      <div className="space-y-4">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        {currentAction && (
          <div className="my-4 p-4 bg-white rounded-lg shadow-md">
            {renderActionComponent()}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;