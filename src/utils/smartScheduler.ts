import { 
  SmartSchedule, 
  SmartWeek, 
  SmartRoom, 
  SmartTimeSlot, 
  SmartBooking, 
  StaffMember, 
  Procedure, 
  SchedulingConflict, 
  SchedulingConstraints,
  OptimizationSettings,
  StaffRole,
  DayOfWeek,
  TimeSlotType
} from '../types/smartSchedule';

// Smart scheduling algorithms and utilities

export class SmartScheduler {
  private staff: StaffMember[] = [];
  private procedures: Procedure[] = [];
  private constraints: SchedulingConstraints;
  private optimizationSettings: OptimizationSettings;

  constructor(
    constraints: SchedulingConstraints,
    optimizationSettings: OptimizationSettings
  ) {
    this.constraints = constraints;
    this.optimizationSettings = optimizationSettings;
  }

  // Set staff and procedures data
  setStaff(staff: StaffMember[]) {
    this.staff = staff;
  }

  setProcedures(procedures: Procedure[]) {
    this.procedures = procedures;
  }

  // Main scheduling function
  generateSmartSchedule(
    year: number,
    month: number,
    selectedDay: DayOfWeek,
    existingBookings: SmartBooking[] = []
  ): SmartSchedule {
    const weeks = this.generateWeeks(year, month, selectedDay);
    
    // Apply existing bookings
    this.applyExistingBookings(weeks, existingBookings);
    
    // Detect and resolve conflicts
    this.detectConflicts(weeks);
    
    // Optimize schedule based on settings
    this.optimizeSchedule(weeks);
    
    // Calculate utilization metrics
    this.calculateUtilization(weeks);

    return {
      id: `schedule-${year}-${month}`,
      year,
      month,
      selectedDay,
      weeks,
      constraints: this.constraints,
      optimizationSettings: this.optimizationSettings
    };
  }

  private generateWeeks(year: number, month: number, selectedDay: DayOfWeek): SmartWeek[] {
    const weeks: SmartWeek[] = [];
    const numberOfWeeks = this.getWeeksInMonthForDay(year, month, selectedDay);
    const weekDates = this.getWeekDates(year, month, selectedDay);

    for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
      const rooms = this.generateRooms(weekIndex + 1);
      const weekDate = weekDates[weekIndex];

      weeks.push({
        id: `week-${weekIndex + 1}`,
        name: `Week ${weekIndex + 1}`,
        date: weekDate || '',
        rooms,
        conflicts: [],
        utilization: {
          totalSlots: 0,
          bookedSlots: 0,
          utilizationRate: 0,
          staffUtilization: 0,
          roomUtilization: 0
        }
      });
    }

    return weeks;
  }

  private generateRooms(weekNumber: number): SmartRoom[] {
    const rooms: SmartRoom[] = [];
    
    // Generate different types of rooms
    const roomTypes = [
      { id: 'operating-room-1', name: 'Operating Room 1', type: 'operating', size: 50, features: ['sterile', 'ventilation', 'imaging'] },
      { id: 'operating-room-2', name: 'Operating Room 2', type: 'operating', size: 45, features: ['sterile', 'ventilation'] },
      { id: 'procedure-room-1', name: 'Procedure Room 1', type: 'procedure', size: 30, features: ['sterile'] },
      { id: 'consultation-room-1', name: 'Consultation Room 1', type: 'consultation', size: 20, features: [] }
    ];

    roomTypes.forEach((roomConfig, index) => {
      const timeSlots = this.generateTimeSlots(weekNumber, roomConfig.id);
      
      rooms.push({
        id: roomConfig.id,
        name: roomConfig.name,
        type: roomConfig.type,
        timeSlots,
        availability: { isAvailable: true },
        utilization: {
          totalSlots: timeSlots.length,
          bookedSlots: 0,
          utilizationRate: 0,
          averageBookingDuration: 0
        }
      });
    });

    return rooms;
  }

  private generateTimeSlots(weekNumber: number, roomId: string): SmartTimeSlot[] {
    const timeSlots: SmartTimeSlot[] = [];
    const slotTypes: TimeSlotType[] = ['AM', 'PM', 'FULL_DAY'];
    
    slotTypes.forEach((type, index) => {
      const startTime = type === 'AM' ? '08:00' : type === 'PM' ? '13:00' : '08:00';
      const endTime = type === 'AM' ? '12:00' : type === 'PM' ? '17:00' : '17:00';
      
      timeSlots.push({
        id: `week-${weekNumber}-${roomId}-${type.toLowerCase()}`,
        type,
        startTime,
        endTime,
        availableStaff: this.getAvailableStaff(startTime, endTime),
        conflicts: [],
        suggestedBookings: []
      });
    });

    return timeSlots;
  }

  private getAvailableStaff(startTime: string, endTime: string): StaffMember[] {
    return this.staff.filter(staff => {
      // Check if staff is available during this time slot
      return this.isStaffAvailable(staff, startTime, endTime);
    });
  }

  private isStaffAvailable(staff: StaffMember, startTime: string, endTime: string): boolean {
    // Check if staff is available during the specified time
    // This is a simplified check - in a real implementation, you'd check against their schedule
    const today = new Date().toISOString().split('T')[0];
    const exception = staff.availability.exceptions.find(ex => ex.date === today);
    
    if (exception) {
      return exception.isAvailable;
    }
    
    // Check if the time falls within working hours
    const workingStart = staff.availability.startTime;
    const workingEnd = staff.availability.endTime;
    
    return startTime >= workingStart && endTime <= workingEnd;
  }

  private applyExistingBookings(weeks: SmartWeek[], existingBookings: SmartBooking[]) {
    existingBookings.forEach(booking => {
      const week = weeks.find(w => w.id === `week-${booking.weekNumber}`);
      if (week) {
        const room = week.rooms.find(r => r.id === booking.roomId);
        if (room) {
          const timeSlot = room.timeSlots.find(ts => ts.type === booking.timeSlotType);
          if (timeSlot) {
            timeSlot.booking = booking;
          }
        }
      }
    });
  }

  private detectConflicts(weeks: SmartWeek[]) {
    weeks.forEach(week => {
      week.rooms.forEach(room => {
        room.timeSlots.forEach(timeSlot => {
          if (timeSlot.booking) {
            const conflicts = this.checkBookingConflicts(timeSlot.booking, week);
            timeSlot.conflicts = conflicts;
            week.conflicts.push(...conflicts);
          }
        });
      });
    });
  }

  private checkBookingConflicts(booking: SmartBooking, week: SmartWeek): SchedulingConflict[] {
    const conflicts: SchedulingConflict[] = [];

    // Check staff availability conflicts
    booking.assignedStaff.forEach(staff => {
      const staffMember = this.staff.find(s => s.id === staff.staffId);
      if (staffMember && !this.isStaffAvailable(staffMember, staff.startTime, staff.endTime)) {
        conflicts.push({
          type: 'staff_unavailable',
          severity: 'high',
          description: `${staffMember.name} is not available during this time slot`,
          affectedElements: [staffMember.id],
          suggestedResolutions: [
            'Assign a different staff member',
            'Reschedule the procedure',
            'Check staff availability for alternative times'
          ]
        });
      }
    });

    // Check for double bookings
    const overlappingBookings = week.rooms.flatMap(room => 
      room.timeSlots.filter(ts => 
        ts.booking && 
        ts.booking.id !== booking.id &&
        this.isTimeOverlap(ts.booking, booking)
      )
    );

    if (overlappingBookings.length > 0) {
      conflicts.push({
        type: 'double_booking',
        severity: 'critical',
        description: 'Multiple procedures scheduled for the same time slot',
        affectedElements: overlappingBookings.map(b => b.id),
        suggestedResolutions: [
          'Reschedule one of the procedures',
          'Use a different room',
          'Adjust procedure timing'
        ]
      });
    }

    return conflicts;
  }

  private isTimeOverlap(booking1: SmartBooking, booking2: SmartBooking): boolean {
    const start1 = new Date(`2000-01-01 ${booking1.startTime}`);
    const end1 = new Date(`2000-01-01 ${booking1.endTime}`);
    const start2 = new Date(`2000-01-01 ${booking2.startTime}`);
    const end2 = new Date(`2000-01-01 ${booking2.endTime}`);

    return start1 < end2 && start2 < end1;
  }

  private optimizeSchedule(weeks: SmartWeek[]) {
    if (this.optimizationSettings.prioritizeUrgentCases) {
      this.prioritizeUrgentCases(weeks);
    }

    if (this.optimizationSettings.maximizeRoomUtilization) {
      this.maximizeRoomUtilization(weeks);
    }

    if (this.optimizationSettings.minimizeStaffOvertime) {
      this.minimizeStaffOvertime(weeks);
    }

    if (this.optimizationSettings.balanceWorkload) {
      this.balanceWorkload(weeks);
    }
  }

  private prioritizeUrgentCases(weeks: SmartWeek[]) {
    // Sort bookings by priority (urgent first)
    weeks.forEach(week => {
      week.rooms.forEach(room => {
        room.timeSlots.forEach(timeSlot => {
          if (timeSlot.booking && timeSlot.booking.priority === 'urgent') {
            // Ensure urgent cases get the best available slots
            this.optimizeTimeSlotForUrgentCase(timeSlot);
          }
        });
      });
    });
  }

  private optimizeTimeSlotForUrgentCase(timeSlot: SmartTimeSlot) {
    // Implementation for optimizing urgent cases
    // This could involve moving other bookings to make room for urgent cases
  }

  private maximizeRoomUtilization(weeks: SmartWeek[]) {
    // Implement room utilization optimization
    // This could involve filling gaps and optimizing room assignments
  }

  private minimizeStaffOvertime(weeks: SmartWeek[]) {
    // Implement staff overtime minimization
    // This could involve redistributing workload
  }

  private balanceWorkload(weeks: SmartWeek[]) {
    // Implement workload balancing
    // This could involve ensuring even distribution of work
  }

  private calculateUtilization(weeks: SmartWeek[]) {
    weeks.forEach(week => {
      let totalSlots = 0;
      let bookedSlots = 0;

      week.rooms.forEach(room => {
        room.timeSlots.forEach(timeSlot => {
          totalSlots++;
          if (timeSlot.booking) {
            bookedSlots++;
          }
        });

        // Calculate room utilization
        room.utilization.totalSlots = room.timeSlots.length;
        room.utilization.bookedSlots = room.timeSlots.filter(ts => ts.booking).length;
        room.utilization.utilizationRate = room.utilization.bookedSlots / room.utilization.totalSlots;
      });

      // Calculate week utilization
      week.utilization.totalSlots = totalSlots;
      week.utilization.bookedSlots = bookedSlots;
      week.utilization.utilizationRate = bookedSlots / totalSlots;
    });
  }

  // Helper functions (copied from original scheduleUtils for compatibility)
  private getWeeksInMonthForDay(year: number, month: number, selectedDay: DayOfWeek): number {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const dayMap: Record<DayOfWeek, number> = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    const targetDay = dayMap[selectedDay];
    
    let firstOccurrence = new Date(year, month, 1);
    while (firstOccurrence.getDay() !== targetDay) {
      firstOccurrence.setDate(firstOccurrence.getDate() + 1);
    }
    
    if (firstOccurrence.getMonth() !== month) {
      return 0;
    }
    
    const daysInMonth = lastDay.getDate();
    const firstDayDate = firstOccurrence.getDate();
    const remainingDays = daysInMonth - firstDayDate + 1;
    const weeksNeeded = Math.ceil(remainingDays / 7);
    
    return Math.max(1, weeksNeeded);
  }

  private getWeekDates(year: number, month: number, selectedDay: DayOfWeek): string[] {
    const dayMap: Record<DayOfWeek, number> = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    
    const targetDay = dayMap[selectedDay];
    
    let currentDate = new Date(year, month, 1);
    while (currentDate.getDay() !== targetDay) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    if (currentDate.getMonth() !== month) {
      return [];
    }
    
    const dates: string[] = [];
    const lastDay = new Date(year, month + 1, 0);
    
    while (currentDate <= lastDay) {
      dates.push(currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      }));
      currentDate.setDate(currentDate.getDate() + 7);
    }
    
    return dates;
  }
} 