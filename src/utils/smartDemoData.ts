import { 
  StaffMember, 
  Procedure, 
  SmartBooking, 
  StaffRole, 
  StaffSpecialty, 
  DayOfWeek,
  TimeSlotType,
  SchedulingConstraints,
  OptimizationSettings
} from '../types/smartSchedule';

// Demo staff members
export const demoStaff: StaffMember[] = [
  {
    id: 'staff-001',
    name: 'Dr. Sarah Johnson',
    role: 'surgeon',
    specialties: ['cardiology', 'general'],
    email: 'sarah.johnson@rutherfordclinic.com',
    phone: '+1-555-0101',
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '08:00',
      endTime: '17:00',
      timezone: 'America/New_York',
      exceptions: []
    },
    preferences: {
      preferredDays: ['Monday', 'Wednesday', 'Friday'],
      preferredTimeSlots: ['AM', 'PM'],
      maxConsecutiveDays: 3,
      preferredRoomTypes: ['operating'],
      avoidConcurrentSurgeries: true
    },
    maxHoursPerWeek: 40,
    currentHoursThisWeek: 0
  },
  {
    id: 'staff-002',
    name: 'Dr. Michael Chen',
    role: 'surgeon',
    specialties: ['orthopedics', 'trauma'],
    email: 'michael.chen@rutherfordclinic.com',
    phone: '+1-555-0102',
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      startTime: '07:00',
      endTime: '16:00',
      timezone: 'America/New_York',
      exceptions: []
    },
    preferences: {
      preferredDays: ['Tuesday', 'Thursday'],
      preferredTimeSlots: ['AM'],
      maxConsecutiveDays: 4,
      preferredRoomTypes: ['operating'],
      avoidConcurrentSurgeries: true
    },
    maxHoursPerWeek: 35,
    currentHoursThisWeek: 0
  },
  {
    id: 'staff-003',
    name: 'Dr. Emily White',
    role: 'anaesthetist',
    specialties: ['general', 'pediatrics'],
    email: 'emily.white@rutherfordclinic.com',
    phone: '+1-555-0103',
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '08:00',
      endTime: '18:00',
      timezone: 'America/New_York',
      exceptions: []
    },
    preferences: {
      preferredDays: ['Monday', 'Wednesday', 'Friday'],
      preferredTimeSlots: ['AM', 'PM'],
      maxConsecutiveDays: 5,
      preferredRoomTypes: ['operating', 'procedure'],
      avoidConcurrentSurgeries: false
    },
    maxHoursPerWeek: 45,
    currentHoursThisWeek: 0
  },
  {
    id: 'staff-004',
    name: 'Nurse Jane Smith',
    role: 'nurse',
    specialties: ['general', 'emergency'],
    email: 'jane.smith@rutherfordclinic.com',
    phone: '+1-555-0104',
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '08:00',
      endTime: '17:00',
      timezone: 'America/New_York',
      exceptions: []
    },
    preferences: {
      preferredDays: ['Monday', 'Tuesday', 'Wednesday'],
      preferredTimeSlots: ['AM', 'PM'],
      maxConsecutiveDays: 5,
      preferredRoomTypes: ['operating', 'procedure'],
      avoidConcurrentSurgeries: false
    },
    maxHoursPerWeek: 40,
    currentHoursThisWeek: 0
  },
  {
    id: 'staff-005',
    name: 'Nurse Bob Wilson',
    role: 'nurse',
    specialties: ['cardiology', 'general'],
    email: 'bob.wilson@rutherfordclinic.com',
    phone: '+1-555-0105',
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '08:00',
      endTime: '17:00',
      timezone: 'America/New_York',
      exceptions: []
    },
    preferences: {
      preferredDays: ['Thursday', 'Friday'],
      preferredTimeSlots: ['PM'],
      maxConsecutiveDays: 4,
      preferredRoomTypes: ['operating'],
      avoidConcurrentSurgeries: false
    },
    maxHoursPerWeek: 40,
    currentHoursThisWeek: 0
  }
];

// Demo procedures
export const demoProcedures: Procedure[] = [
  {
    id: 'proc-001',
    name: 'Coronary Artery Bypass Graft (CABG)',
    code: 'CABG-001',
    duration: 240, // 4 hours
    staffRequirements: [
      { role: 'surgeon', count: 1, specialties: ['cardiology'] },
      { role: 'anaesthetist', count: 1 },
      { role: 'nurse', count: 3 }
    ],
    equipmentRequirements: [
      { equipmentId: 'eq-001', name: 'Heart-Lung Machine', quantity: 1, setupTime: 30, cleanupTime: 20 },
      { equipmentId: 'eq-002', name: 'Surgical Instruments', quantity: 1, setupTime: 15, cleanupTime: 10 }
    ],
    roomRequirements: {
      roomTypes: ['operating'],
      minSize: 50,
      specialFeatures: ['sterile', 'ventilation', 'imaging']
    },
    priority: 'high',
    estimatedCost: 50000,
    category: 'Cardiac Surgery'
  },
  {
    id: 'proc-002',
    name: 'Knee Arthroscopy',
    code: 'ARTH-001',
    duration: 90, // 1.5 hours
    staffRequirements: [
      { role: 'surgeon', count: 1, specialties: ['orthopedics'] },
      { role: 'anaesthetist', count: 1 },
      { role: 'nurse', count: 2 }
    ],
    equipmentRequirements: [
      { equipmentId: 'eq-003', name: 'Arthroscope', quantity: 1, setupTime: 20, cleanupTime: 15 },
      { equipmentId: 'eq-004', name: 'Surgical Instruments', quantity: 1, setupTime: 10, cleanupTime: 10 }
    ],
    roomRequirements: {
      roomTypes: ['operating', 'procedure'],
      minSize: 30,
      specialFeatures: ['sterile']
    },
    priority: 'medium',
    estimatedCost: 15000,
    category: 'Orthopedic Surgery'
  },
  {
    id: 'proc-003',
    name: 'Appendectomy',
    code: 'APP-001',
    duration: 60, // 1 hour
    staffRequirements: [
      { role: 'surgeon', count: 1, specialties: ['general'] },
      { role: 'anaesthetist', count: 1 },
      { role: 'nurse', count: 2 }
    ],
    equipmentRequirements: [
      { equipmentId: 'eq-005', name: 'Laparoscopic Equipment', quantity: 1, setupTime: 15, cleanupTime: 10 },
      { equipmentId: 'eq-006', name: 'Surgical Instruments', quantity: 1, setupTime: 10, cleanupTime: 10 }
    ],
    roomRequirements: {
      roomTypes: ['operating'],
      minSize: 40,
      specialFeatures: ['sterile']
    },
    priority: 'urgent',
    estimatedCost: 12000,
    category: 'General Surgery'
  },
  {
    id: 'proc-004',
    name: 'Consultation',
    code: 'CONS-001',
    duration: 30, // 30 minutes
    staffRequirements: [
      { role: 'surgeon', count: 1 },
      { role: 'nurse', count: 1 }
    ],
    equipmentRequirements: [],
    roomRequirements: {
      roomTypes: ['consultation'],
      minSize: 20,
      specialFeatures: []
    },
    priority: 'low',
    estimatedCost: 200,
    category: 'Consultation'
  }
];

// Demo smart bookings
export const demoSmartBookings: SmartBooking[] = [
  {
    id: 'booking-001',
    date: '2024-01-15',
    dayOfWeek: 'Monday',
    weekNumber: 1,
    roomId: 'operating-room-1',
    timeSlotType: 'AM',
    procedure: demoProcedures[0], // CABG
    assignedStaff: [
      {
        staffId: 'staff-001',
        role: 'surgeon',
        name: 'Dr. Sarah Johnson',
        startTime: '08:00',
        endTime: '12:00',
        isConfirmed: true
      },
      {
        staffId: 'staff-003',
        role: 'anaesthetist',
        name: 'Dr. Emily White',
        startTime: '08:00',
        endTime: '12:00',
        isConfirmed: true
      },
      {
        staffId: 'staff-004',
        role: 'nurse',
        name: 'Nurse Jane Smith',
        startTime: '08:00',
        endTime: '12:00',
        isConfirmed: true
      }
    ],
    startTime: '08:00',
    endTime: '12:00',
    status: 'scheduled',
    priority: 'high',
    notes: 'Patient has cardiac history, requires careful monitoring'
  },
  {
    id: 'booking-002',
    date: '2024-01-15',
    dayOfWeek: 'Monday',
    weekNumber: 1,
    roomId: 'operating-room-2',
    timeSlotType: 'PM',
    procedure: demoProcedures[1], // Knee Arthroscopy
    assignedStaff: [
      {
        staffId: 'staff-002',
        role: 'surgeon',
        name: 'Dr. Michael Chen',
        startTime: '13:00',
        endTime: '14:30',
        isConfirmed: true
      },
      {
        staffId: 'staff-003',
        role: 'anaesthetist',
        name: 'Dr. Emily White',
        startTime: '13:00',
        endTime: '14:30',
        isConfirmed: true
      },
      {
        staffId: 'staff-005',
        role: 'nurse',
        name: 'Nurse Bob Wilson',
        startTime: '13:00',
        endTime: '14:30',
        isConfirmed: true
      }
    ],
    startTime: '13:00',
    endTime: '14:30',
    status: 'scheduled',
    priority: 'medium',
    notes: 'Routine arthroscopic procedure'
  }
];

// Default scheduling constraints
export const defaultConstraints: SchedulingConstraints = {
  maxConcurrentSurgeries: 2,
  minStaffPerSurgery: 3,
  maxStaffHoursPerWeek: 40,
  roomSetupBuffer: 15, // minutes
  staffBreakTime: 30, // minutes
  emergencyBuffer: 0.1 // 10% of slots reserved for emergencies
};

// Default optimization settings
export const defaultOptimizationSettings: OptimizationSettings = {
  prioritizeUrgentCases: true,
  maximizeRoomUtilization: true,
  minimizeStaffOvertime: true,
  balanceWorkload: true,
  considerStaffPreferences: true,
  emergencySlotReservation: 0.1 // 10%
}; 