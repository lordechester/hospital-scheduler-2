import { MonthSchedule, Week, Room, TimeSlot, BookingDetails, DayOfWeek } from '../types/schedule';
import { getBookingForTimeSlot } from './bookingStorage';

// Function to get the number of weeks in a month based on selected day
export const getWeeksInMonthForDay = (year: number, month: number, selectedDay: DayOfWeek): number => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Convert day name to day number (0 = Sunday, 1 = Monday, etc.)
  const dayMap: Record<DayOfWeek, number> = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  
  const targetDay = dayMap[selectedDay];
  
  // Find the first occurrence of the selected day in the month
  let firstOccurrence = new Date(year, month, 1);
  while (firstOccurrence.getDay() !== targetDay) {
    firstOccurrence.setDate(firstOccurrence.getDate() + 1);
  }
  
  // If the first occurrence is in the next month, return 0
  if (firstOccurrence.getMonth() !== month) {
    return 0;
  }
  
  // Calculate how many weeks we can fit
  const daysInMonth = lastDay.getDate();
  const firstDayDate = firstOccurrence.getDate();
  const remainingDays = daysInMonth - firstDayDate + 1;
  const weeksNeeded = Math.ceil(remainingDays / 7);
  
  return Math.max(1, weeksNeeded);
};

// Function to get the dates for each week based on selected day
export const getWeekDates = (year: number, month: number, selectedDay: DayOfWeek): string[] => {
  const dayMap: Record<DayOfWeek, number> = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
  };
  
  const targetDay = dayMap[selectedDay];
  
  // Find the first occurrence of the selected day in the month
  let currentDate = new Date(year, month, 1);
  while (currentDate.getDay() !== targetDay) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // If the first occurrence is in the next month, return empty array
  if (currentDate.getMonth() !== month) {
    return [];
  }
  
  const dates: string[] = [];
  const lastDay = new Date(year, month + 1, 0);
  
  while (currentDate <= lastDay) {
    dates.push(currentDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return dates;
};

export const createInitialSchedule = (year: number, month: number, selectedDay: DayOfWeek): MonthSchedule => {
  const weeks: Week[] = [];
  const numberOfWeeks = getWeeksInMonthForDay(year, month, selectedDay);
  const weekDates = getWeekDates(year, month, selectedDay);
  
  for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
    const rooms: Room[] = [];
    const weekDate = weekDates[weekIndex];
    
    // Create 2 rooms per week
    for (let roomIndex = 0; roomIndex < 2; roomIndex++) {
      const timeSlots: TimeSlot[] = [
        {
          id: `week-${weekIndex + 1}-room-${roomIndex + 1}-am`,
          type: 'AM',
          booking: getBookingForTimeSlot(weekDate, weekIndex + 1, roomIndex + 1, 'AM') || undefined
        },
        {
          id: `week-${weekIndex + 1}-room-${roomIndex + 1}-pm`,
          type: 'PM',
          booking: getBookingForTimeSlot(weekDate, weekIndex + 1, roomIndex + 1, 'PM') || undefined
        }
      ];
      
      rooms.push({
        id: `room-${roomIndex + 1}`,
        name: `Room ${roomIndex + 1}`,
        timeSlots
      });
    }
    
    weeks.push({
      id: `week-${weekIndex + 1}`,
      name: `Week ${weekIndex + 1}`,
      date: weekDate || '',
      rooms
    });
  }
  
  return {
    year,
    month,
    selectedDay,
    weeks
  };
};

export const updateTimeSlotBooking = (
  schedule: MonthSchedule,
  timeSlotId: string,
  booking: BookingDetails
): MonthSchedule => {
  const updatedWeeks = schedule.weeks.map(week => ({
    ...week,
    rooms: week.rooms.map(room => ({
      ...room,
      timeSlots: room.timeSlots.map(timeSlot => 
        timeSlot.id === timeSlotId 
          ? { ...timeSlot, booking }
          : timeSlot
      )
    }))
  }));
  
  return {
    ...schedule,
    weeks: updatedWeeks
  };
};

export const findTimeSlotById = (
  schedule: MonthSchedule,
  timeSlotId: string
): TimeSlot | null => {
  for (const week of schedule.weeks) {
    for (const room of week.rooms) {
      const timeSlot = room.timeSlots.find(ts => ts.id === timeSlotId);
      if (timeSlot) {
        return timeSlot;
      }
    }
  }
  return null;
}; 