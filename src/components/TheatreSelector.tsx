import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import { Theatre } from '../types';

interface TheatreSelectorProps {
  theatres: Theatre[];
  onSelect: (theatre: Theatre) => void;
}

const TheatreSelector: React.FC<TheatreSelectorProps> = ({ theatres, onSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Available Theatres</h3>
      <div className="grid gap-3">
        {theatres.map((theatre) => (
          <div 
            key={theatre.id}
            className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            onClick={() => onSelect(theatre)}
          >
            <div className="font-medium text-gray-900">{theatre.name}</div>
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>{theatre.location}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {theatre.showtimes.map((time, index) => (
                <div 
                  key={index}
                  className="flex items-center px-2 py-1 bg-gray-100 rounded text-sm"
                >
                  <Clock size={14} className="mr-1" />
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreSelector;