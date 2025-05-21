import React from 'react';
import { Download, Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { TicketData } from '../types';

interface TicketDisplayProps {
  ticketData: TicketData;
  onClose: () => void;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ ticketData, onClose }) => {
  const downloadTicket = () => {
    // This would typically use html2canvas or a similar library
    // For now, we'll just simulate a download delay
    const ticketElement = document.getElementById('movie-ticket');
    if (!ticketElement) return;
    
    alert('Your ticket is being downloaded!');
    // In a real implementation, we would convert the ticket to an image and download it
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800 text-center">Your Ticket is Ready!</h3>
      
      <div id="movie-ticket" className="movie-ticket p-4">
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-indigo-900 to-blue-800 text-white">
            <div className="text-xl font-bold">{ticketData.movieTitle}</div>
            <div className="text-sm opacity-90">{ticketData.genre}</div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <Calendar size={16} />
              <span>{ticketData.date}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <Clock size={16} />
              <span>{ticketData.time}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <MapPin size={16} />
              <span>{ticketData.theatre}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <Ticket size={16} />
              <span>Seats: {ticketData.seats.join(', ')}</span>
            </div>
          </div>
          
          <div className="ticket-stub p-4 bg-gray-100 border-t border-dashed border-gray-300">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500">Booking ID</div>
                <div className="font-mono text-sm">{ticketData.bookingId}</div>
              </div>
              
              <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                QR Code
              </div>
            </div>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              Present this ticket at the box office
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
          onClick={onClose}
        >
          <span>Close</span>
        </button>
        
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
          onClick={downloadTicket}
        >
          <Download size={16} />
          <span>Download Ticket</span>
        </button>
      </div>
    </div>
  );
};

export default TicketDisplay;