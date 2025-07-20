import { useState, useEffect } from 'react';
import { MonthSelector } from './components/MonthSelector';
import { DaySelector } from './components/DaySelector';
import { Week } from './components/Week';
import { BookingModal } from './components/BookingModal';
import { MonthSchedule, TimeSlot, BookingDetails, DayOfWeek } from './types/schedule';
import { createInitialSchedule, findTimeSlotById } from './utils/scheduleUtils';
import { saveBooking } from './utils/bookingStorage';
import { createDemoSchedule } from './utils/demoData';

function App() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');
  const [schedule, setSchedule] = useState<MonthSchedule | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize demo data on first load
  useEffect(() => {
    if (!isInitialized) {
      createDemoSchedule(currentYear, currentMonth, selectedDay);
      setIsInitialized(true);
    }
  }, [isInitialized, currentYear, currentMonth, selectedDay]);

  // Initialize schedule when year, month, or selected day changes
  useEffect(() => {
    if (isInitialized) {
      setSchedule(createInitialSchedule(currentYear, currentMonth, selectedDay));
    }
  }, [currentYear, currentMonth, selectedDay, isInitialized]);

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleDayChange = (day: DayOfWeek) => {
    setSelectedDay(day);
  };

  const handleBookTimeSlot = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  const handleEditTimeSlot = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setIsModalOpen(true);
  };

  const handleSaveBooking = (booking: BookingDetails) => {
    if (schedule && selectedTimeSlot) {
      // Extract week number, room number, and time slot type from the time slot ID
      const match = selectedTimeSlot.id.match(/week-(\d+)-room-(\d+)-(am|pm)/);
      if (match) {
        const weekNumber = parseInt(match[1]);
        const roomNumber = parseInt(match[2]);
        const timeSlotType = match[3].toUpperCase() as 'AM' | 'PM';
        
        // Get the date for this week
        const week = schedule.weeks.find(w => w.id === `week-${weekNumber}`);
        if (week && week.date) {
          // Save the booking to persistent storage
          saveBooking(week.date, selectedDay, weekNumber, roomNumber, timeSlotType, booking);
          
          // Update the schedule to reflect the new booking
          setSchedule(createInitialSchedule(currentYear, currentMonth, selectedDay));
        }
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTimeSlot(null);
  };

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-6">
            <div className="text-center mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🏥 Hospital Room Scheduler
              </h1>
              <p className="text-lg text-gray-600">
                Manage room bookings and staff assignments
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

          {/* Schedule Display */}
          <div className="space-y-6">
            {schedule.weeks.map((week) => (
              <Week
                key={week.id}
                week={week}
                onBookTimeSlot={handleBookTimeSlot}
                onEditTimeSlot={handleEditTimeSlot}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedTimeSlot && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveBooking}
          timeSlot={selectedTimeSlot}
          initialBooking={selectedTimeSlot.booking}
        />
      )}
    </div>
  );
}

export default App 