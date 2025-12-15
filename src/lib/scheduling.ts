import { format, addMinutes, isAfter, isBefore, isSameDay } from 'date-fns';

// Service durations in minutes - CRITICAL: Must match business rules
export const SERVICE_DURATIONS: Record<string, number> = {
  'siruq': 15,      // סירוק - 15 minutes
  'tiqun': 15,      // תיקון - 15 minutes
  'purchase': 60,   // קניית פאה - 60 minutes
  'consultation': 30, // ייעוץ - 30 minutes (optional)
};

// Working hours configuration
interface WorkingShift {
  start: string; // HH:mm
  end: string;   // HH:mm
}

interface DaySchedule {
  shifts: WorkingShift[];
}

// CRITICAL: Working hours as specified
// Regular days: 09:30 - 14:45
// Monday (1) and Wednesday (3): additional evening shift 21:00-23:00
// Friday (5) and Saturday (6): closed
const WORKING_HOURS: Record<number, DaySchedule> = {
  0: { shifts: [{ start: '09:30', end: '14:45' }] }, // Sunday
  1: { shifts: [{ start: '09:30', end: '14:45' }, { start: '21:00', end: '23:00' }] }, // Monday
  2: { shifts: [{ start: '09:30', end: '14:45' }] }, // Tuesday
  3: { shifts: [{ start: '09:30', end: '14:45' }, { start: '21:00', end: '23:00' }] }, // Wednesday
  4: { shifts: [{ start: '09:30', end: '14:45' }] }, // Thursday
  5: { shifts: [] }, // Friday - closed
  6: { shifts: [] }, // Saturday - closed
};

const SLOT_STEP_MINUTES = 15;

export interface TimeSlot {
  time: string;
  available: boolean;
  shift: 'morning' | 'evening';
}

export interface ExistingAppointment {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
}

// Mock existing appointments
export const mockExistingAppointments: ExistingAppointment[] = [
  { date: format(new Date(), 'yyyy-MM-dd'), time: '10:00', duration: 15 },
  { date: format(new Date(), 'yyyy-MM-dd'), time: '10:15', duration: 60 },
  { date: format(new Date(), 'yyyy-MM-dd'), time: '11:30', duration: 15 },
  { date: format(new Date(), 'yyyy-MM-dd'), time: '21:00', duration: 30 },
];

/**
 * Parse time string to Date object for a given date
 */
function parseTime(date: Date, timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Check if a time slot conflicts with existing appointments
 */
function hasConflict(
  date: Date,
  slotStart: Date,
  slotEnd: Date,
  existingAppointments: ExistingAppointment[]
): boolean {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  for (const apt of existingAppointments) {
    if (apt.date !== dateStr) continue;
    
    const aptStart = parseTime(date, apt.time);
    const aptEnd = addMinutes(aptStart, apt.duration);
    
    // Check for overlap
    if (isBefore(slotStart, aptEnd) && isAfter(slotEnd, aptStart)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generate available time slots for a given date and service
 */
export function generateTimeSlots(
  date: Date,
  serviceDurationMinutes: number,
  existingAppointments: ExistingAppointment[] = mockExistingAppointments
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const schedule = WORKING_HOURS[dayOfWeek];
  
  if (!schedule || schedule.shifts.length === 0) {
    return [];
  }
  
  const slots: TimeSlot[] = [];
  
  for (const shift of schedule.shifts) {
    const shiftStart = parseTime(date, shift.start);
    const shiftEnd = parseTime(date, shift.end);
    const isEvening = shift.start >= '18:00';
    
    let currentSlot = new Date(shiftStart);
    
    while (true) {
      const slotEnd = addMinutes(currentSlot, serviceDurationMinutes);
      
      // CRITICAL: Service can only be booked if full duration fits within shift
      if (isAfter(slotEnd, shiftEnd)) {
        break;
      }
      
      const timeStr = format(currentSlot, 'HH:mm');
      const hasConflictWithExisting = hasConflict(date, currentSlot, slotEnd, existingAppointments);
      
      // Check if slot is in the past
      const isPast = isSameDay(date, new Date()) && isBefore(currentSlot, new Date());
      
      slots.push({
        time: timeStr,
        available: !hasConflictWithExisting && !isPast,
        shift: isEvening ? 'evening' : 'morning',
      });
      
      currentSlot = addMinutes(currentSlot, SLOT_STEP_MINUTES);
    }
  }
  
  return slots;
}

/**
 * Get service duration by service ID
 */
export function getServiceDuration(serviceId: string): number {
  return SERVICE_DURATIONS[serviceId] || 15;
}

/**
 * Check if a date is a working day
 */
export function isWorkingDay(date: Date): boolean {
  const dayOfWeek = date.getDay();
  const schedule = WORKING_HOURS[dayOfWeek];
  return schedule && schedule.shifts.length > 0;
}

/**
 * Get working hours description for a date
 */
export function getWorkingHoursDescription(date: Date): string {
  const dayOfWeek = date.getDay();
  const schedule = WORKING_HOURS[dayOfWeek];
  
  if (!schedule || schedule.shifts.length === 0) {
    return 'סגור';
  }
  
  return schedule.shifts
    .map(s => `${s.start} - ${s.end}`)
    .join(' | ');
}

/**
 * Check if has evening shift
 */
export function hasEveningShift(date: Date): boolean {
  const dayOfWeek = date.getDay();
  const schedule = WORKING_HOURS[dayOfWeek];
  return schedule?.shifts.some(s => s.start >= '18:00') || false;
}

/**
 * Hebrew number conversion
 */
const HEBREW_NUMERALS: Record<number, string> = {
  1: 'א׳', 2: 'ב׳', 3: 'ג׳', 4: 'ד׳', 5: 'ה׳',
  6: 'ו׳', 7: 'ז׳', 8: 'ח׳', 9: 'ט׳', 10: 'י׳',
  11: 'י״א', 12: 'י״ב', 13: 'י״ג', 14: 'י״ד', 15: 'ט״ו',
  16: 'ט״ז', 17: 'י״ז', 18: 'י״ח', 19: 'י״ט', 20: 'כ׳',
  21: 'כ״א', 22: 'כ״ב', 23: 'כ״ג', 24: 'כ״ד', 25: 'כ״ה',
  26: 'כ״ו', 27: 'כ״ז', 28: 'כ״ח', 29: 'כ״ט', 30: 'ל׳',
};

const HEBREW_MONTHS = [
  'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון',
  'תמוז', 'אב', 'אלול', 'תשרי', 'חשון', 'כסלו'
];

/**
 * Convert Gregorian date to Hebrew date label
 * Note: This is a simplified mock implementation
 * For production, use a proper Hebrew calendar library like hebcal
 */
export function getHebrewDateLabel(date: Date): string {
  // Simple approximation for UI demonstration
  // In production, integrate with @hebcal/core or similar
  const day = date.getDate();
  const monthIndex = date.getMonth();
  
  const hebrewDay = HEBREW_NUMERALS[day] || `${day}`;
  // Approximate Hebrew month (offset by ~2 months)
  const hebrewMonthIndex = (monthIndex + 9) % 12;
  const hebrewMonth = HEBREW_MONTHS[hebrewMonthIndex];
  
  return `${hebrewDay} ${hebrewMonth}`;
}

/**
 * Check if cancellation is allowed based on deadline
 */
export function canCancelAppointment(
  appointmentDate: string,
  appointmentTime: string,
  deadlineHours: number = 24
): boolean {
  const [year, month, day] = appointmentDate.split('-').map(Number);
  const [hours, minutes] = appointmentTime.split(':').map(Number);
  
  const appointmentDateTime = new Date(year, month - 1, day, hours, minutes);
  const now = new Date();
  const deadline = new Date(appointmentDateTime.getTime() - deadlineHours * 60 * 60 * 1000);
  
  return isBefore(now, deadline);
}

/**
 * Get the reminder date (1 day before appointment)
 */
export function getReminderDate(appointmentDate: string): Date {
  const date = new Date(appointmentDate);
  date.setDate(date.getDate() - 1);
  return date;
}

/**
 * Generate reminder message for wig washing
 */
export function getWashingReminderMessage(appointmentTime: string): string {
  return `תזכורת: נא להביא את הפאה לכביסה לפני השעה 14:30 ביום שלפני התור שלך בשעה ${appointmentTime}`;
}
