import { format, addMinutes, isAfter, isBefore, parse, isSameDay } from 'date-fns';

// Service durations in minutes
export const SERVICE_DURATIONS: Record<string, number> = {
  'siruq': 15,      // סירוק
  'tiqun': 15,      // תיקון
  'purchase': 60,   // קניית פאה
  'consultation': 30, // ייעוץ
};

// Working hours configuration
interface WorkingShift {
  start: string; // HH:mm
  end: string;   // HH:mm
}

interface DaySchedule {
  shifts: WorkingShift[];
}

// Regular days: until 14:45
// Monday (1) and Wednesday (3): additional evening shift 21:00-23:00
const WORKING_HOURS: Record<number, DaySchedule> = {
  0: { shifts: [{ start: '09:00', end: '14:45' }] }, // Sunday
  1: { shifts: [{ start: '09:00', end: '14:45' }, { start: '21:00', end: '23:00' }] }, // Monday
  2: { shifts: [{ start: '09:00', end: '14:45' }] }, // Tuesday
  3: { shifts: [{ start: '09:00', end: '14:45' }, { start: '21:00', end: '23:00' }] }, // Wednesday
  4: { shifts: [{ start: '09:00', end: '14:45' }] }, // Thursday
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
      
      // Check if the service fits within the shift
      if (isAfter(slotEnd, shiftEnd)) {
        break;
      }
      
      const timeStr = format(currentSlot, 'HH:mm');
      const hasConflictWithExisting = hasConflict(date, currentSlot, slotEnd, existingAppointments);
      
      // Also check if slot is in the past
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
 * Convert Gregorian date to Hebrew date label (mock implementation)
 * In production, use a proper Hebrew calendar library
 */
export function getHebrewDateLabel(date: Date): string {
  // Mock Hebrew months
  const hebrewMonths = [
    'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון',
    'תמוז', 'אב', 'אלול', 'תשרי', 'חשון', 'כסלו'
  ];
  
  // Mock Hebrew day numbers
  const hebrewDays: Record<number, string> = {
    1: 'א׳', 2: 'ב׳', 3: 'ג׳', 4: 'ד׳', 5: 'ה׳',
    6: 'ו׳', 7: 'ז׳', 8: 'ח׳', 9: 'ט׳', 10: 'י׳',
    11: 'י״א', 12: 'י״ב', 13: 'י״ג', 14: 'י״ד', 15: 'ט״ו',
    16: 'ט״ז', 17: 'י״ז', 18: 'י״ח', 19: 'י״ט', 20: 'כ׳',
    21: 'כ״א', 22: 'כ״ב', 23: 'כ״ג', 24: 'כ״ד', 25: 'כ״ה',
    26: 'כ״ו', 27: 'כ״ז', 28: 'כ״ח', 29: 'כ״ט', 30: 'ל׳',
  };
  
  // Simple mock calculation (not accurate, for UI demonstration)
  const day = date.getDate();
  const monthIndex = date.getMonth();
  
  const hebrewDay = hebrewDays[day] || `${day}`;
  const hebrewMonth = hebrewMonths[monthIndex];
  
  return `${hebrewDay} ${hebrewMonth}`;
}
