import React from 'react';
import { SmartWeek as SmartWeekType, SmartRoom as SmartRoomType, SmartTimeSlot as SmartTimeSlotType, SmartBooking, SchedulingConflict } from '../types/smartSchedule';
import { SmartTimeSlot } from './SmartTimeSlot';

interface SmartWeekProps {
  week: SmartWeekType;
  onBookTimeSlot: (timeSlot: SmartTimeSlotType) => void;
  onEditTimeSlot: (timeSlot: SmartTimeSlotType) => void;
  onResolveConflict: (conflict: SchedulingConflict) => void;
}

export const SmartWeek: React.FC<SmartWeekProps> = ({
  week,
  onBookTimeSlot,
  onEditTimeSlot,
  onResolveConflict
}) => {
  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    if (rate >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Week Header with Utilization Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{week.name}</h3>
            <p className="text-sm text-gray-600">{week.date}</p>
          </div>
          
          {/* Utilization Metrics */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className={`text-lg font-bold ${getUtilizationColor(week.utilization.utilizationRate)}`}>
                {Math.round(week.utilization.utilizationRate * 100)}%
              </div>
              <div className="text-xs text-gray-500">Utilization</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">
                {week.utilization.bookedSlots}/{week.utilization.totalSlots}
              </div>
              <div className="text-xs text-gray-500">Booked Slots</div>
            </div>
          </div>
        </div>

        {/* Conflicts Summary */}
        {week.conflicts.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-red-700">
                {week.conflicts.length} conflict{week.conflicts.length !== 1 ? 's' : ''} detected
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rooms Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {week.rooms.map((room) => (
            <SmartRoom
              key={room.id}
              room={room}
              onBookTimeSlot={onBookTimeSlot}
              onEditTimeSlot={onEditTimeSlot}
            />
          ))}
        </div>
      </div>

      {/* Conflicts Detail */}
      {week.conflicts.length > 0 && (
        <div className="border-t border-gray-200 bg-red-50">
          <div className="px-6 py-4">
            <h4 className="text-sm font-semibold text-red-800 mb-3">Scheduling Conflicts</h4>
            <div className="space-y-2">
              {week.conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getConflictSeverityColor(conflict.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{conflict.description}</div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Affected:</span> {conflict.affectedElements.join(', ')}
                      </div>
                      {conflict.suggestedResolutions.length > 0 && (
                        <div className="text-sm mt-2">
                          <span className="font-medium">Suggestions:</span>
                          <ul className="list-disc list-inside mt-1">
                            {conflict.suggestedResolutions.map((resolution, idx) => (
                              <li key={idx}>{resolution}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onResolveConflict(conflict)}
                      className="ml-3 px-3 py-1 text-xs font-medium bg-white rounded border hover:bg-gray-50 transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Smart Room Component
interface SmartRoomProps {
  room: SmartRoomType;
  onBookTimeSlot: (timeSlot: SmartTimeSlotType) => void;
  onEditTimeSlot: (timeSlot: SmartTimeSlotType) => void;
}

const SmartRoom: React.FC<SmartRoomProps> = ({ room, onBookTimeSlot, onEditTimeSlot }) => {
  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'operating': return 'bg-red-100 text-red-800';
      case 'procedure': return 'bg-blue-100 text-blue-800';
      case 'consultation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    if (rate >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Room Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">{room.name}</h4>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoomTypeColor(room.type)}`}>
                {room.type}
              </span>
              {!room.availability.isAvailable && (
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Unavailable
                </span>
              )}
            </div>
          </div>
          
          {/* Room Utilization */}
          <div className="text-right">
            <div className={`text-lg font-bold ${getUtilizationColor(room.utilization.utilizationRate)}`}>
              {Math.round(room.utilization.utilizationRate * 100)}%
            </div>
            <div className="text-xs text-gray-500">
              {room.utilization.bookedSlots}/{room.utilization.totalSlots}
            </div>
          </div>
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-4 space-y-3">
        {room.timeSlots.map((timeSlot) => (
          <SmartTimeSlot
            key={timeSlot.id}
            timeSlot={timeSlot}
            onBook={onBookTimeSlot}
            onEdit={onEditTimeSlot}
          />
        ))}
      </div>
    </div>
  );
}; 