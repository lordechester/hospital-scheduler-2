import { PersistentBooking, DayOfWeek, BookingDetails } from '../types/schedule';

// Storage key for localStorage
const BOOKINGS_STORAGE_KEY = 'hospital-scheduler-bookings';

// Get all stored bookings
export const getAllBookings = (): PersistentBooking[] => {
  try {
    const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading bookings:', error);
    return [];
  }
};

// Save all bookings
export const saveAllBookings = (bookings: PersistentBooking[]): void => {
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings:', error);
  }
};

// Get bookings for a specific day of week
export const getBookingsForDay = (dayOfWeek: DayOfWeek): PersistentBooking[] => {
  const allBookings = getAllBookings();
  return allBookings.filter(booking => booking.dayOfWeek === dayOfWeek);
};

// Add or update a booking
export const saveBooking = (
  date: string,
  dayOfWeek: DayOfWeek,
  weekNumber: number,
  roomNumber: number,
  timeSlotType: 'AM' | 'PM',
  booking: BookingDetails
): void => {
  const allBookings = getAllBookings();
  
  // Remove existing booking for this slot if it exists
  const filteredBookings = allBookings.filter(
    b => !(b.date === date && b.weekNumber === weekNumber && b.roomNumber === roomNumber && b.timeSlotType === timeSlotType)
  );
  
  // Add new booking
  const newBooking: PersistentBooking = {
    date,
    dayOfWeek,
    weekNumber,
    roomNumber,
    timeSlotType,
    booking
  };
  
  saveAllBookings([...filteredBookings, newBooking]);
};

// Remove a booking
export const removeBooking = (
  date: string,
  weekNumber: number,
  roomNumber: number,
  timeSlotType: 'AM' | 'PM'
): void => {
  const allBookings = getAllBookings();
  const filteredBookings = allBookings.filter(
    b => !(b.date === date && b.weekNumber === weekNumber && b.roomNumber === roomNumber && b.timeSlotType === timeSlotType)
  );
  saveAllBookings(filteredBookings);
};

// Get booking for a specific time slot
export const getBookingForTimeSlot = (
  date: string,
  weekNumber: number,
  roomNumber: number,
  timeSlotType: 'AM' | 'PM'
): BookingDetails | null => {
  const allBookings = getAllBookings();
  const booking = allBookings.find(
    b => b.date === date && b.weekNumber === weekNumber && b.roomNumber === roomNumber && b.timeSlotType === timeSlotType
  );
  return booking ? booking.booking : null;
}; 

// Clear all bookings (for testing)
export const clearAllBookings = (): void => {
  try {
    localStorage.removeItem(BOOKINGS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing bookings:', error);
  }
}; 