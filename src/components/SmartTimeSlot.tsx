import React from 'react';
import { SmartTimeSlot as SmartTimeSlotType, SmartBooking, SchedulingConflict, StaffMember } from '../types/smartSchedule';

interface SmartTimeSlotProps {
  timeSlot: SmartTimeSlotType;
  onBook: (timeSlot: SmartTimeSlotType) => void;
  onEdit: (timeSlot: SmartTimeSlotType) => void;
}

export const SmartTimeSlot: React.FC<SmartTimeSlotProps> = ({
  timeSlot,
  onBook,
  onEdit
}) => {
  const getTimeSlotTypeColor = (type: string) => {
    switch (type) {
      case 'AM': return 'bg-blue-100 text-blue-800';
      case 'PM': return 'bg-green-100 text-green-800';
      case 'FULL_DAY': return 'bg-purple-100 text-purple-800';
      case 'CUSTOM': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConflictSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-300 bg-red-50';
      case 'high': return 'border-orange-300 bg-orange-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'low': return 'border-blue-300 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const hasConflicts = timeSlot.conflicts.length > 0;
  const hasSuggestions = timeSlot.suggestedBookings.length > 0;

  return (
    <div className={`border rounded-lg p-3 transition-all duration-200 ${
      hasConflicts 
        ? 'border-red-300 bg-red-50' 
        : timeSlot.booking 
          ? 'border-green-300 bg-green-50' 
          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
    }`}>
      {/* Time Slot Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTimeSlotTypeColor(timeSlot.type)}`}>
            {timeSlot.type}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {timeSlot.startTime} - {timeSlot.endTime}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1">
          {timeSlot.booking ? (
            <button
              onClick={() => onEdit(timeSlot)}
              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={() => onBook(timeSlot)}
              className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
            >
              Book
            </button>
          )}
        </div>
      </div>

      {/* Booking Information */}
      {timeSlot.booking && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">{timeSlot.booking.procedure.name}</h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(timeSlot.booking.priority)}`}>
              {timeSlot.booking.priority}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <div>Duration: {timeSlot.booking.procedure.duration} minutes</div>
            <div>Status: {timeSlot.booking.status}</div>
          </div>

          {/* Assigned Staff */}
          <div className="text-sm">
            <div className="font-medium text-gray-700 mb-1">Assigned Staff:</div>
            <div className="space-y-1">
              {timeSlot.booking.assignedStaff.map((staff, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">{staff.name}</span>
                  <span className="text-xs text-gray-500">{staff.role}</span>
                </div>
              ))}
            </div>
          </div>

          {timeSlot.booking.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <div className="font-medium">Notes:</div>
              <div className="italic">{timeSlot.booking.notes}</div>
            </div>
          )}
        </div>
      )}

      {/* Available Staff */}
      {!timeSlot.booking && timeSlot.availableStaff.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 mb-1">Available Staff:</div>
          <div className="space-y-1">
            {timeSlot.availableStaff.slice(0, 3).map((staff, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{staff.name}</span>
                <span className="text-gray-500">{staff.role}</span>
              </div>
            ))}
            {timeSlot.availableStaff.length > 3 && (
              <div className="text-xs text-gray-500">
                +{timeSlot.availableStaff.length - 3} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conflicts */}
      {hasConflicts && (
        <div className="mb-3">
          <div className="text-sm font-medium text-red-700 mb-2">⚠️ Conflicts:</div>
          <div className="space-y-2">
            {timeSlot.conflicts.map((conflict, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${getConflictSeverityColor(conflict.severity)}`}
              >
                <div className="text-xs font-medium">{conflict.description}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Severity: {conflict.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {hasSuggestions && !timeSlot.booking && (
        <div className="mb-3">
          <div className="text-sm font-medium text-blue-700 mb-2">💡 Suggestions:</div>
          <div className="space-y-2">
            {timeSlot.suggestedBookings.map((suggestion, index) => (
              <div key={index} className="p-2 rounded border border-blue-200 bg-blue-50">
                <div className="text-xs font-medium">{suggestion.procedure.name}</div>
                <div className="text-xs text-gray-600">
                  Confidence: {Math.round(suggestion.confidence * 100)}%
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {suggestion.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!timeSlot.booking && !hasConflicts && !hasSuggestions && (
        <div className="text-sm text-gray-500 italic">
          No booking scheduled
        </div>
      )}
    </div>
  );
}; 