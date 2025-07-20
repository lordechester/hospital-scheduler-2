import React from 'react';
import { DayOfWeek } from '../types/schedule';

interface DaySelectorProps {
  selectedDay: DayOfWeek;
  onDayChange: (day: DayOfWeek) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDay,
  onDayChange
}) => {
  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold text-gray-700">Day of Week:</label>
        <select
          value={selectedDay}
          onChange={(e) => onDayChange(e.target.value as DayOfWeek)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      
      <div className="text-sm text-gray-500 font-medium">
        Scheduling for {selectedDay}s
      </div>
    </div>
  );
}; 