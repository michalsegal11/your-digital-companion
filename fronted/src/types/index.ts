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
}

export interface TimeSlot {
  time: string;
  available: boolean;
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
  status: 'scheduled' | 'arrived' | 'completed' | 'cancelled';
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

export interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}

export interface Reminder {
  id: string;
  type: 'holiday' | 'appointment' | 'followup';
  title: string;
  message: string;
  sendVia: 'phone' | 'email' | 'both';
  enabled: boolean;
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
