import type {
  Customer,
  Service,
  Appointment,
  Subscriber,
  TimeSlot,
  CustomerReport,
  KPIData,
  Repair,
  Combing,
  Reminder,
} from '@/types';
import {
  mockServices,
  mockCustomers,
  mockAppointments,
  mockSubscribers,
  mockKPIData,
  mockCustomerReports,
  mockIncomeExpensesByYear,
  mockRepairs,
  mockCombings,
  mockReminders,
} from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all available services
 * TODO: Replace with actual API call
 */
export async function getServices(): Promise<Service[]> {
  await delay(300);
  return mockServices;
}

/**
 * Get available time slots for a specific date and service
 * TODO: Replace with actual API call
 */
export async function getAvailableSlots(date: string, serviceId: string): Promise<TimeSlot[]> {
  await delay(500);
  
  // Generate mock time slots
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (const minutes of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes}`;
      // Randomly make some slots unavailable
      const available = Math.random() > 0.3;
      slots.push({ time, available });
    }
  }
  
  return slots;
}

/**
 * Create a new appointment
 * TODO: Replace with actual API call
 */
export async function createAppointment(payload: {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}): Promise<Appointment> {
  await delay(800);
  
  const service = mockServices.find(s => s.id === payload.serviceId);
  
  const appointment: Appointment = {
    id: Date.now().toString(),
    customerId: '',
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail,
    serviceId: payload.serviceId,
    serviceName: service?.name || '',
    date: payload.date,
    time: payload.time,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  
  return appointment;
}

/**
 * Get appointments for a date range
 * TODO: Replace with actual API call
 */
export async function getAppointments(range: { start: string; end: string }): Promise<Appointment[]> {
  await delay(400);
  
  return mockAppointments.filter(apt => {
    return apt.date >= range.start && apt.date <= range.end;
  });
}

/**
 * Update appointment status
 * TODO: Replace with actual API call
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: Appointment['status']
): Promise<Appointment> {
  await delay(300);
  
  const appointment = mockAppointments.find(a => a.id === appointmentId);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  return { ...appointment, status };
}

/**
 * Cancel an appointment
 * TODO: Replace with actual API call
 */
export async function cancelAppointment(appointmentId: string): Promise<void> {
  await delay(300);
  // TODO: Implement actual cancellation
}

/**
 * Get all customers
 * TODO: Replace with actual API call
 */
export async function getCustomers(): Promise<Customer[]> {
  await delay(400);
  return mockCustomers;
}

/**
 * Get customer by ID
 * TODO: Replace with actual API call
 */
export async function getCustomer(customerId: string): Promise<Customer | null> {
  await delay(300);
  return mockCustomers.find(c => c.id === customerId) || null;
}

/**
 * Update customer notes
 * TODO: Replace with actual API call
 */
export async function updateCustomerNotes(customerId: string, notes: string): Promise<Customer> {
  await delay(300);
  const customer = mockCustomers.find(c => c.id === customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }
  return { ...customer, notes };
}

/**
 * Get customer repairs
 * TODO: Replace with actual API call
 */
export async function getCustomerRepairs(customerId: string): Promise<Repair[]> {
  await delay(300);
  return mockRepairs.filter(r => r.customerId === customerId);
}

/**
 * Get customer combings
 * TODO: Replace with actual API call
 */
export async function getCustomerCombings(customerId: string): Promise<Combing[]> {
  await delay(300);
  return mockCombings.filter(c => c.customerId === customerId);
}

/**
 * Add a repair for a customer
 * TODO: Replace with actual API call
 */
export async function addRepair(customerId: string, repair: Omit<Repair, 'id' | 'customerId'>): Promise<Repair> {
  await delay(300);
  return {
    id: Date.now().toString(),
    customerId,
    ...repair,
  };
}

/**
 * Add a combing for a customer
 * TODO: Replace with actual API call
 */
export async function addCombing(customerId: string, combing: Omit<Combing, 'id' | 'customerId'>): Promise<Combing> {
  await delay(300);
  return {
    id: Date.now().toString(),
    customerId,
    ...combing,
  };
}

/**
 * Get customer report
 * TODO: Replace with actual API call
 */
export async function getCustomerReport(customerId: string): Promise<CustomerReport | null> {
  await delay(500);
  return mockCustomerReports.find(r => r.customerId === customerId) || null;
}

/**
 * Get all subscribers
 * TODO: Replace with actual API call
 */
export async function getSubscribers(): Promise<Subscriber[]> {
  await delay(400);
  return mockSubscribers;
}

/**
 * Add a new subscriber
 * TODO: Replace with actual API call
 */
export async function addSubscriber(email: string): Promise<Subscriber> {
  await delay(500);
  return {
    id: Date.now().toString(),
    email,
    signupDate: new Date().toISOString().split('T')[0],
    consent: true,
  };
}

/**
 * Get income and expenses for a year
 * TODO: Replace with actual API call
 */
export async function getIncomeExpenses(year: string): Promise<{ month: string; income: number; expense: number }[]> {
  await delay(400);
  return mockIncomeExpensesByYear[year] || [];
}

/**
 * Get KPI data for dashboard
 * TODO: Replace with actual API call
 */
export async function getKPIData(): Promise<KPIData> {
  await delay(300);
  return mockKPIData;
}

/**
 * Get all customer reports (for reports page)
 * TODO: Replace with actual API call
 */
export async function getAllCustomerReports(): Promise<CustomerReport[]> {
  await delay(500);
  return mockCustomerReports;
}

/**
 * Get reminders configuration
 * TODO: Replace with actual API call
 */
export async function getReminders(): Promise<Reminder[]> {
  await delay(300);
  return mockReminders;
}

/**
 * Update reminder
 * TODO: Replace with actual API call
 */
export async function updateReminder(reminder: Reminder): Promise<Reminder> {
  await delay(300);
  return reminder;
}

/**
 * Send test reminder
 * TODO: Replace with actual API call
 */
export async function sendTestReminder(reminderId: string): Promise<void> {
  await delay(1000);
  // TODO: Implement actual reminder sending
}

/**
 * Generate PDF report
 * TODO: Replace with actual API call
 */
export async function generatePDFReport(type: string, params?: Record<string, unknown>): Promise<void> {
  await delay(2000);
  // TODO: Implement actual PDF generation
}

/**
 * Mock login function
 * TODO: Replace with actual authentication
 */
export async function login(email: string, password: string): Promise<{ success: boolean; user?: { name: string; email: string } }> {
  await delay(800);
  
  // Mock authentication - accept any credentials for demo
  if (email && password) {
    return {
      success: true,
      user: {
        name: 'מנהלת',
        email: email,
      },
    };
  }
  
  return { success: false };
}

/**
 * Mock logout function
 * TODO: Replace with actual authentication
 */
export async function logout(): Promise<void> {
  await delay(300);
  // TODO: Implement actual logout
}
