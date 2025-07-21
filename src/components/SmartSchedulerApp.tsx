import React, { useState, useEffect } from 'react';
import { MonthSelector } from './MonthSelector';
import { DaySelector } from './DaySelector';
import { SmartWeek } from './SmartWeek';
import { SmartScheduler } from '../utils/smartScheduler';
import { SmartSchedule, SmartTimeSlot, SchedulingConflict, DayOfWeek } from '../types/smartSchedule';
import { demoStaff, demoProcedures, demoSmartBookings, defaultConstraints, defaultOptimizationSettings } from '../utils/smartDemoData';

export const SmartSchedulerApp: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [schedule, setSchedule] = useState<SmartSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize smart scheduler
  const smartScheduler = new SmartScheduler(defaultConstraints, defaultOptimizationSettings);

  // Initialize with demo data
  useEffect(() => {
    smartScheduler.setStaff(demoStaff);
    smartScheduler.setProcedures(demoProcedures);
    
    // Generate initial schedule
    const initialSchedule = smartScheduler.generateSmartSchedule(
      currentYear,
      currentMonth,
      selectedDay,
      demoSmartBookings
    );
    
    setSchedule(initialSchedule);
    setIsLoading(false);
  }, []);

  // Regenerate schedule when parameters change
  useEffect(() => {
    if (!isLoading) {
      const newSchedule = smartScheduler.generateSmartSchedule(
        currentYear,
        currentMonth,
        selectedDay,
        demoSmartBookings
      );
      setSchedule(newSchedule);
    }
  }, [currentYear, currentMonth, selectedDay, isLoading]);

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleDayChange = (day: DayOfWeek) => {
    setSelectedDay(day);
  };

  const handleBookTimeSlot = (timeSlot: SmartTimeSlot) => {
    console.log('Booking time slot:', timeSlot);
    // TODO: Implement booking modal
  };

  const handleEditTimeSlot = (timeSlot: SmartTimeSlot) => {
    console.log('Editing time slot:', timeSlot);
    // TODO: Implement edit modal
  };

  const handleResolveConflict = (conflict: SchedulingConflict) => {
    console.log('Resolving conflict:', conflict);
    // TODO: Implement conflict resolution
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading smart schedule...</p>
        </div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No schedule available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Main Content - Full Width */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🧠 Smart Hospital Scheduler
              </h1>
              <p className="text-lg text-gray-600">
                AI-powered scheduling with conflict detection and optimization
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="space-y-3">
                <MonthSelector
                  year={currentYear}
                  month={currentMonth}
                  onMonthChange={handleMonthChange}
                  onYearChange={handleYearChange}
                />
                <div className="border-t border-gray-200 pt-3">
                  <DaySelector
                    selectedDay={selectedDay}
                    onDayChange={handleDayChange}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Smart Schedule Display */}
          <div className="space-y-6">
            {schedule.weeks.map((week) => (
              <SmartWeek
                key={week.id}
                week={week}
                onBookTimeSlot={handleBookTimeSlot}
                onEditTimeSlot={handleEditTimeSlot}
                onResolveConflict={handleResolveConflict}
              />
            ))}
          </div>

          {/* Smart Features Summary */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">🎯</div>
                <div className="font-medium text-gray-900">Conflict Detection</div>
                <div className="text-sm text-gray-600">Automatically detects scheduling conflicts</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">⚡</div>
                <div className="font-medium text-gray-900">Optimization</div>
                <div className="text-sm text-gray-600">AI-powered schedule optimization</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">📊</div>
                <div className="font-medium text-gray-900">Analytics</div>
                <div className="text-sm text-gray-600">Real-time utilization metrics</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">💡</div>
                <div className="font-medium text-gray-900">Suggestions</div>
                <div className="text-sm text-gray-600">Smart booking recommendations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 