import { MonthSchedule, BookingDetails, DayOfWeek } from '../types/schedule';
import { createInitialSchedule, updateTimeSlotBooking } from './scheduleUtils';

export const createDemoSchedule = (year: number, month: number, selectedDay: DayOfWeek): MonthSchedule => {
  let schedule = createInitialSchedule(year, month, selectedDay);
  
  // Add some demo bookings
  const demoBookings: { timeSlotId: string; booking: BookingDetails }[] = [
    {
      timeSlotId: 'week-1-room-1-am',
      booking: {
        surgeon: 'Dr. John Doe',
        nurses: ['Nurse Jane', 'Nurse Bob'],
        anaesthetist: 'Dr. Emily White'
      }
    },
    {
      timeSlotId: 'week-1-room-2-pm',
      booking: {
        surgeon: 'Dr. Sarah Johnson',
        nurses: ['Nurse Mike', 'Nurse Lisa', 'Nurse Tom'],
        anaesthetist: 'Dr. Robert Chen'
      }
    },
    {
      timeSlotId: 'week-2-room-1-am',
      booking: {
        surgeon: 'Dr. Michael Brown',
        nurses: ['Nurse Alice', 'Nurse David', 'Nurse Emma', 'Nurse Frank'],
        anaesthetist: 'Dr. Patricia Wilson'
      }
    },
    {
      timeSlotId: 'week-3-room-2-pm',
      booking: {
        surgeon: 'Dr. Jennifer Lee',
        nurses: ['Nurse Grace', 'Nurse Henry'],
        anaesthetist: 'Dr. Kevin Martinez'
      }
    }
  ];
  
  // Apply demo bookings
  demoBookings.forEach(({ timeSlotId, booking }) => {
    schedule = updateTimeSlotBooking(schedule, timeSlotId, booking);
  });
  
  return schedule;
}; 