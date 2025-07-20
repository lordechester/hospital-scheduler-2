import React from 'react';
import { Week as WeekType, TimeSlot } from '../types/schedule';
import { TimeSlot as TimeSlotComponent } from './TimeSlot';

interface WeekProps {
  week: WeekType;
  onBookTimeSlot: (timeSlot: TimeSlot) => void;
  onEditTimeSlot?: (timeSlot: TimeSlot) => void;
}

export const Week: React.FC<WeekProps> = ({ week, onBookTimeSlot, onEditTimeSlot }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {week.name}
          </h2>
          {week.date && (
            <p className="text-blue-100 text-sm">
              {week.date}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {week.rooms.map((room) => (
          <div key={room.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-semibold">
                {room.name}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {room.timeSlots.map((timeSlot) => (
                <TimeSlotComponent
                  key={timeSlot.id}
                  timeSlot={timeSlot}
                  onBook={onBookTimeSlot}
                  onEdit={onEditTimeSlot}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 