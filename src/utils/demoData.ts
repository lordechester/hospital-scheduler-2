import { BookingDetails, DayOfWeek } from '../types/schedule';
import { saveBooking } from './bookingStorage';

export const createDemoSchedule = (year: number, month: number, selectedDay: DayOfWeek): void => {
  // Add some demo bookings for different days of the week
  const demoBookings: {
    date: string;
    dayOfWeek: DayOfWeek;
    weekNumber: number;
    roomNumber: number;
    timeSlotType: 'AM' | 'PM';
    booking: BookingDetails;
  }[] = [
    {
      date: '2024-01-01', // Monday
      dayOfWeek: 'Monday',
      weekNumber: 1,
      roomNumber: 1,
      timeSlotType: 'AM',
      booking: {
        surgeon: 'Dr. John Doe',
        nurses: ['Nurse Jane', 'Nurse Bob'],
        anaesthetist: 'Dr. Emily White'
      }
    },
    {
      date: '2024-01-01', // Monday
      dayOfWeek: 'Monday',
      weekNumber: 1,
      roomNumber: 2,
      timeSlotType: 'PM',
      booking: {
        surgeon: 'Dr. Sarah Johnson',
        nurses: ['Nurse Mike', 'Nurse Lisa', 'Nurse Tom'],
        anaesthetist: 'Dr. Robert Chen'
      }
    },
    {
      date: '2024-01-08', // Monday
      dayOfWeek: 'Monday',
      weekNumber: 2,
      roomNumber: 1,
      timeSlotType: 'AM',
      booking: {
        surgeon: 'Dr. Michael Brown',
        nurses: ['Nurse Alice', 'Nurse David', 'Nurse Emma', 'Nurse Frank'],
        anaesthetist: 'Dr. Patricia Wilson'
      }
    },
    {
      date: '2024-01-02', // Tuesday
      dayOfWeek: 'Tuesday',
      weekNumber: 1,
      roomNumber: 1,
      timeSlotType: 'AM',
      booking: {
        surgeon: 'Dr. Jennifer Lee',
        nurses: ['Nurse Grace', 'Nurse Henry'],
        anaesthetist: 'Dr. Kevin Martinez'
      }
    },
    {
      date: '2024-01-02', // Tuesday
      dayOfWeek: 'Tuesday',
      weekNumber: 1,
      roomNumber: 2,
      timeSlotType: 'PM',
      booking: {
        surgeon: 'Dr. David Wilson',
        nurses: ['Nurse Sarah', 'Nurse James'],
        anaesthetist: 'Dr. Lisa Anderson'
      }
    }
  ];
  
  // Apply demo bookings
  demoBookings.forEach(({ date, dayOfWeek, weekNumber, roomNumber, timeSlotType, booking }) => {
    saveBooking(date, dayOfWeek, weekNumber, roomNumber, timeSlotType, booking);
  });
}; 