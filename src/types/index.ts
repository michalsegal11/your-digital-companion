export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  purchaseDate?: string;
  warrantyStatus: 'active' | 'expired' | 'none';
  warrantyEndDate?: string;
  freeCombingsMonths: number;
  freeCombingsUsed: number;
  notes: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  shift?: 'morning' | 'evening';
}

export interface ReminderPreference {
  enabled: boolean;
  channels: {
    email: boolean;
    sms: boolean;
  };
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  hebrewDate?: string;
  status: 'scheduled' | 'arrived' | 'completed' | 'cancelled';
  reminderPreference?: ReminderPreference;
  reminderSent?: boolean;
  cancellationReason?: string;
  createdAt: string;
}

export interface Repair {
  id: string;
  customerId: string;
  date: string;
  description: string;
  cost: number;
  isFree: boolean;
}

export interface Combing {
  id: string;
  customerId: string;
  date: string;
  isFree: boolean;
}

export interface Subscriber {
  id: string;
  email: string;
  signupDate: string;
  consent: boolean;
}

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  customerId?: string;
}

export interface WorkingShift {
  start: string; // HH:mm
  end: string;   // HH:mm
  enabled: boolean;
}

export interface WorkingHours {
  dayOfWeek: number;
  dayName: string;
  morningShift: WorkingShift;
  eveningShift?: WorkingShift;
  isWorkingDay: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

export interface Reminder {
  id: string;
  type: 'holiday' | 'appointment' | 'followup' | 'washing';
  title: string;
  message: string;
  sendVia: 'phone' | 'email' | 'both';
  enabled: boolean;
  sendBeforeDays?: number;
}

export interface KPIData {
  todayAppointments: number;
  weekAppointments: number;
  subscribersCount: number;
  monthlyCombings: number;
  combingsTrend: number;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  totalRepairsCost: number;
  repairsCount: number;
  monthlyBreakdown: {
    month: string;
    cost: number;
    count: number;
  }[];
}

export interface Notification {
  id: string;
  type: 'cancellation' | 'new_booking' | 'reminder_sent' | 'system';
  title: string;
  message: string;
  read: boolean;
  appointmentId?: string;
  customerId?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  isPublished: boolean;
}

export interface AboutContent {
  title: string;
  description: string;
  highlights: string[];
  imageUrl?: string;
}

export interface SystemSettings {
  cancellationDeadlineHours: number;
  reminderDaysBefore: number;
  timezone: string;
}
