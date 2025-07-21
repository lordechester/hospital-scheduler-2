import React from 'react';
import { TimeSlot as TimeSlotType, BookingDetails } from '../types/schedule';

interface TimeSlotProps {
  timeSlot: TimeSlotType;
  onBook: (timeSlot: TimeSlotType) => void;
  onEdit?: (timeSlot: TimeSlotType) => void;
}

export const TimeSlot: React.FC<TimeSlotProps> = ({ timeSlot, onBook, onEdit }) => {
  const hasBooking = !!timeSlot.booking;

  const handleClick = () => {
    if (hasBooking && onEdit) {
      onEdit(timeSlot);
    } else {
      onBook(timeSlot);
    }
  };

  const getTimeSlotLabel = () => {
    switch (timeSlot.type) {
      case 'AM':
        return 'AM';
      case 'PM':
        return 'PM';
      default:
        return timeSlot.type;
    }
  };

  if (hasBooking) {
    return (
      <div 
        onClick={handleClick}
        className="bg-white border-2 border-blue-200 rounded-lg p-3 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {getTimeSlotLabel()}
          </div>
          <div className="text-xs text-gray-500 group-hover:text-blue-600">
            Click to edit
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="font-semibold text-gray-900 text-sm">
            {timeSlot.booking?.surgeon}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">Nurses:</span> {timeSlot.booking?.nurses.join(', ')}
          </div>
          <div className="text-xs text-gray-600">
            <span className="font-medium">Anaesthetist:</span> {timeSlot.booking?.anaesthetist || 'None'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={handleClick}
      className="border-2 border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
    >
      <div className="text-center">
        <div className="text-2xl text-gray-400 group-hover:text-blue-500 mb-1 transition-colors">
          +
        </div>
        <div className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
          {getTimeSlotLabel()}
        </div>
        <div className="text-xs text-gray-400 mt-1 group-hover:text-blue-500 transition-colors">
          Click to book
        </div>
      </div>
    </div>
  );
}; 