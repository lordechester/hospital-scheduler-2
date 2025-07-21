// Enhanced types for smart scheduling system

export type StaffRole = 'surgeon' | 'nurse' | 'anaesthetist' | 'support' | 'technician';
export type StaffSpecialty = 'cardiology' | 'orthopedics' | 'neurology' | 'general' | 'emergency' | 'pediatrics' | 'oncology' | 'trauma';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type TimeSlotType = 'AM' | 'PM' | 'FULL_DAY' | 'CUSTOM';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  specialties: StaffSpecialty[];
  email: string;
  phone: string;
  availability: StaffAvailability;
  preferences: StaffPreferences;
  maxHoursPerWeek: number;
  currentHoursThisWeek: number;
}

export interface StaffAvailability {
  workingDays: DayOfWeek[];
  startTime: string; // Format: "08:00"
  endTime: string;   // Format: "17:00"
  timezone: string;
  exceptions: DateException[];
}

export interface DateException {
  date: string; // Format: "YYYY-MM-DD"
  isAvailable: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface StaffPreferences {
  preferredDays: DayOfWeek[];
  preferredTimeSlots: TimeSlotType[];
  maxConsecutiveDays: number;
  preferredRoomTypes?: string[];
  avoidConcurrentSurgeries?: boolean;
}

export interface Procedure {
  id: string;
  name: string;
  code: string;
  duration: number; // in minutes
  staffRequirements: StaffRequirement[];
  equipmentRequirements: EquipmentRequirement[];
  roomRequirements: RoomRequirement;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedCost: number;
  category: string;
}

export interface StaffRequirement {
  role: StaffRole;
  count: number;
  specialties?: StaffSpecialty[];
  minExperience?: number; // in years
}

export interface EquipmentRequirement {
  equipmentId: string;
  name: string;
  quantity: number;
  setupTime: number; // in minutes
  cleanupTime: number; // in minutes
}

export interface RoomRequirement {
  roomTypes: string[];
  minSize: number; // in square meters
  specialFeatures: string[]; // e.g., ["sterile", "ventilation", "imaging"]
}

export interface Room {
  id: string;
  name: string;
  type: string;
  size: number;
  features: string[];
  equipment: RoomEquipment[];
  availability: RoomAvailability;
  setupTime: number; // in minutes
  cleanupTime: number; // in minutes
}

export interface RoomEquipment {
  equipmentId: string;
  name: string;
  quantity: number;
  isAvailable: boolean;
  lastMaintenance: string; // Format: "YYYY-MM-DD"
  nextMaintenance: string; // Format: "YYYY-MM-DD"
}

export interface RoomAvailability {
  isAvailable: boolean;
  maintenanceScheduled?: string; // Format: "YYYY-MM-DD"
  unavailableReason?: string;
}

export interface SmartBooking {
  id: string;
  date: string; // Format: "YYYY-MM-DD"
  dayOfWeek: DayOfWeek;
  weekNumber: number;
  roomId: string;
  timeSlotType: TimeSlotType;
  procedure: Procedure;
  assignedStaff: AssignedStaff[];
  startTime: string; // Format: "HH:MM"
  endTime: string;   // Format: "HH:MM"
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  conflicts?: SchedulingConflict[];
}

export interface AssignedStaff {
  staffId: string;
  role: StaffRole;
  name: string;
  startTime: string;
  endTime: string;
  isConfirmed: boolean;
}

export interface SchedulingConflict {
  type: 'staff_unavailable' | 'room_unavailable' | 'equipment_unavailable' | 'double_booking' | 'staff_overlap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedElements: string[];
  suggestedResolutions: string[];
}

export interface SmartSchedule {
  id: string;
  year: number;
  month: number;
  selectedDay: DayOfWeek;
  weeks: SmartWeek[];
  constraints: SchedulingConstraints;
  optimizationSettings: OptimizationSettings;
}

export interface SmartWeek {
  id: string;
  name: string;
  date: string;
  rooms: SmartRoom[];
  conflicts: SchedulingConflict[];
  utilization: WeekUtilization;
}

export interface SmartRoom {
  id: string;
  name: string;
  type: string;
  timeSlots: SmartTimeSlot[];
  availability: RoomAvailability;
  utilization: RoomUtilization;
}

export interface SmartTimeSlot {
  id: string;
  type: TimeSlotType;
  startTime: string;
  endTime: string;
  booking?: SmartBooking;
  availableStaff: StaffMember[];
  conflicts: SchedulingConflict[];
  suggestedBookings: SuggestedBooking[];
}

export interface SuggestedBooking {
  procedure: Procedure;
  confidence: number; // 0-1
  reasoning: string;
  conflicts: SchedulingConflict[];
}

export interface WeekUtilization {
  totalSlots: number;
  bookedSlots: number;
  utilizationRate: number; // 0-1
  staffUtilization: number; // 0-1
  roomUtilization: number; // 0-1
}

export interface RoomUtilization {
  totalSlots: number;
  bookedSlots: number;
  utilizationRate: number; // 0-1
  averageBookingDuration: number; // in minutes
}

export interface SchedulingConstraints {
  maxConcurrentSurgeries: number;
  minStaffPerSurgery: number;
  maxStaffHoursPerWeek: number;
  roomSetupBuffer: number; // in minutes
  staffBreakTime: number; // in minutes
  emergencyBuffer: number; // percentage of slots reserved for emergencies
}

export interface OptimizationSettings {
  prioritizeUrgentCases: boolean;
  maximizeRoomUtilization: boolean;
  minimizeStaffOvertime: boolean;
  balanceWorkload: boolean;
  considerStaffPreferences: boolean;
  emergencySlotReservation: number; // percentage
}

// Legacy compatibility types
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