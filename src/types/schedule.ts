export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface BookingDetails {
  surgeon: string;
  nurses: string[];
  anaesthetist?: string;
}

export interface TimeSlot {
  id: string;
  type: 'AM' | 'PM';
  booking?: BookingDetails;
}

export interface Room {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
}

export interface Week {
  id: string;
  name: string;
  date: string; // The actual date for this week
  rooms: Room[];
}

export interface MonthSchedule {
  year: number;
  month: number;
  selectedDay: DayOfWeek;
  weeks: Week[];
}

export interface DaySchedule {
  day: string;
  week: Week;
}

export interface PersistentBooking {
  date: string; // Format: "YYYY-MM-DD"
  dayOfWeek: DayOfWeek;
  weekNumber: number;
  roomNumber: number;
  timeSlotType: 'AM' | 'PM';
  booking: BookingDetails;
} 