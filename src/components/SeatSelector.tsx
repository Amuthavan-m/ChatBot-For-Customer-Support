import React, { useState } from 'react';
import { Seat } from '../types';

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSelect: (selectedSeats: Seat[]) => void;
}

const SeatSelector: React.FC<SeatSelectorProps> = ({ 
  seats, 
  selectedSeats, 
  onSelect 
}) => {
  const [localSelectedSeats, setLocalSelectedSeats] = useState<Seat[]>(selectedSeats);
  
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'taken') return;
    
    const isSelected = localSelectedSeats.some(s => s.id === seat.id);
    let updatedSeats: Seat[];
    
    if (isSelected) {
      updatedSeats = localSelectedSeats.filter(s => s.id !== seat.id);
    } else {
      updatedSeats = [...localSelectedSeats, seat];
    }
    
    setLocalSelectedSeats(updatedSeats);
  };
  
  const getSeatStatus = (seat: Seat): 'available' | 'selected' | 'taken' => {
    if (seat.status === 'taken') return 'taken';
    if (localSelectedSeats.some(s => s.id === seat.id)) return 'selected';
    return 'available';
  };
  
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.code.charAt(0);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Select Your Seats</h3>
      
      <div className="screen"></div>
      
      <div className="space-y-2">
        {Object.entries(seatsByRow).map(([row, rowSeats]) => (
          <div key={row} className="flex justify-center">
            <span className="w-6 flex items-center justify-center text-sm font-medium text-gray-600">
              {row}
            </span>
            <div className="flex flex-wrap justify-center">
              {rowSeats.map(seat => {
                const status = getSeatStatus(seat);
                return (
                  <div
                    key={seat.id}
                    className={`seat seat-${status}`}
                    onClick={() => handleSeatClick(seat)}
                  >
                    <div className="flex items-center justify-center h-full text-xs font-medium text-white">
                      {seat.code.substring(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <div className="seat-available seat w-4 h-4 mr-2"></div>
          <span className="text-sm text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="seat-selected seat w-4 h-4 mr-2"></div>
          <span className="text-sm text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="seat-taken seat w-4 h-4 mr-2"></div>
          <span className="text-sm text-gray-600">Taken</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-600">Selected Seats: </span>
            <span className="font-medium">
              {localSelectedSeats.length > 0 
                ? localSelectedSeats.map(s => s.code).join(', ') 
                : 'None'}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Total: </span>
            <span className="font-medium">
              ${localSelectedSeats.reduce((sum, seat) => sum + seat.price, 0).toFixed(2)}
            </span>
          </div>
        </div>
        
        <button
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={localSelectedSeats.length === 0}
          onClick={() => onSelect(localSelectedSeats)}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default SeatSelector;