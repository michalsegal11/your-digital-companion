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
  Notification,
  Post,
  AboutContent,
  WorkingHours,
  SystemSettings,
  ReminderPreference,
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
  mockNotifications,
  mockPosts,
  mockAboutContent,
  mockWorkingHours,
  mockSystemSettings,
} from './mockData';
import { generateTimeSlots, getServiceDuration, getHebrewDateLabel, canCancelAppointment } from './scheduling';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all available services
 */
export async function getServices(): Promise<Service[]> {
  await delay(300);
  return mockServices.filter(s => s.isActive);
}

/**
 * Get available time slots for a specific date and service
 * Uses the scheduling logic with proper working hours
 */
export async function getAvailableSlots(date: string, serviceId: string): Promise<TimeSlot[]> {
  await delay(500);
  
  const service = mockServices.find(s => s.id === serviceId);
  const duration = service?.duration || getServiceDuration(serviceId);
  
  // Get existing appointments for conflict checking
  const existingApts = mockAppointments
    .filter(a => a.date === date && a.status !== 'cancelled')
    .map(a => ({
      date: a.date,
      time: a.time,
      duration: mockServices.find(s => s.id === a.serviceId)?.duration || 15,
    }));
  
  const dateObj = new Date(date);
  return generateTimeSlots(dateObj, duration, existingApts);
}

/**
 * Create a new appointment
 */
export async function createAppointment(payload: {
  serviceId: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  reminderPreference?: ReminderPreference;
}): Promise<Appointment> {
  await delay(800);
  
  const service = mockServices.find(s => s.id === payload.serviceId);
  const hebrewDate = getHebrewDateLabel(new Date(payload.date));
  
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
    hebrewDate,
    status: 'scheduled',
    reminderPreference: payload.reminderPreference || { enabled: false, channels: { email: false, sms: false } },
    reminderSent: false,
    createdAt: new Date().toISOString(),
  };
  
  return appointment;
}

/**
 * Update an existing appointment
 */
export async function updateAppointment(
  appointmentId: string,
  updates: Partial<Pick<Appointment, 'serviceId' | 'date' | 'time'>>
): Promise<Appointment> {
  await delay(500);
  
  const appointment = mockAppointments.find(a => a.id === appointmentId);
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  const service = updates.serviceId 
    ? mockServices.find(s => s.id === updates.serviceId)
    : mockServices.find(s => s.id === appointment.serviceId);
  
  const hebrewDate = updates.date 
    ? getHebrewDateLabel(new Date(updates.date))
    : appointment.hebrewDate;
  
  return {
    ...appointment,
    ...updates,
    serviceName: service?.name || appointment.serviceName,
    hebrewDate,
  };
}

/**
 * Cancel an appointment (with deadline check)
 */
export async function cancelAppointment(
  appointmentId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  await delay(300);
  
  const appointment = mockAppointments.find(a => a.id === appointmentId);
  if (!appointment) {
    return { success: false, error: 'התור לא נמצא' };
  }
  
  // Check cancellation deadline
  const canCancel = canCancelAppointment(
    appointment.date,
    appointment.time,
    mockSystemSettings.cancellationDeadlineHours
  );
  
  if (!canCancel) {
    return { 
      success: false, 
      error: `לא ניתן לבטל תור פחות מ-${mockSystemSettings.cancellationDeadlineHours} שעות לפני מועדו` 
    };
  }
  
  // In real implementation, this would also create a notification for the manager
  return { success: true };
}

/**
 * Get appointments for a date range
 */
export async function getAppointments(range: { start: string; end: string }): Promise<Appointment[]> {
  await delay(400);
  
  return mockAppointments.filter(apt => {
    return apt.date >= range.start && apt.date <= range.end;
  });
}

/**
 * Update appointment status
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
 * Get all customers
 */
export async function getCustomers(): Promise<Customer[]> {
  await delay(400);
  return mockCustomers;
}

/**
 * Get customer by ID
 */
export async function getCustomer(customerId: string): Promise<Customer | null> {
  await delay(300);
  return mockCustomers.find(c => c.id === customerId) || null;
}

/**
 * Update customer notes
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
 */
export async function getCustomerRepairs(customerId: string): Promise<Repair[]> {
  await delay(300);
  return mockRepairs.filter(r => r.customerId === customerId);
}

/**
 * Get customer combings
 */
export async function getCustomerCombings(customerId: string): Promise<Combing[]> {
  await delay(300);
  return mockCombings.filter(c => c.customerId === customerId);
}

/**
 * Add a repair for a customer
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
 */
export async function getCustomerReport(customerId: string): Promise<CustomerReport | null> {
  await delay(500);
  return mockCustomerReports.find(r => r.customerId === customerId) || null;
}

/**
 * Get all subscribers
 */
export async function getSubscribers(): Promise<Subscriber[]> {
  await delay(400);
  return mockSubscribers;
}

/**
 * Add a new subscriber
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
 */
export async function getIncomeExpenses(year: string): Promise<{ month: string; income: number; expense: number }[]> {
  await delay(400);
  return mockIncomeExpensesByYear[year] || [];
}

/**
 * Get KPI data for dashboard
 */
export async function getKPIData(): Promise<KPIData> {
  await delay(300);
  return mockKPIData;
}

/**
 * Get all customer reports (for reports page)
 */
export async function getAllCustomerReports(): Promise<CustomerReport[]> {
  await delay(500);
  return mockCustomerReports;
}

/**
 * Get reminders configuration
 */
export async function getReminders(): Promise<Reminder[]> {
  await delay(300);
  return mockReminders;
}

/**
 * Update reminder
 */
export async function updateReminder(reminder: Reminder): Promise<Reminder> {
  await delay(300);
  return reminder;
}

/**
 * Send test reminder
 */
export async function sendTestReminder(reminderId: string): Promise<void> {
  await delay(1000);
}

/**
 * Generate PDF report
 */
export async function generatePDFReport(type: string, params?: Record<string, unknown>): Promise<void> {
  await delay(2000);
}

/**
 * Get notifications for manager
 */
export async function getNotifications(): Promise<Notification[]> {
  await delay(300);
  return mockNotifications;
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId: string): Promise<void> {
  await delay(200);
}

/**
 * Get all posts
 */
export async function getPosts(): Promise<Post[]> {
  await delay(300);
  return mockPosts;
}

/**
 * Create/Update post
 */
export async function savePost(post: Omit<Post, 'id'> & { id?: string }): Promise<Post> {
  await delay(500);
  return {
    id: post.id || Date.now().toString(),
    ...post,
  } as Post;
}

/**
 * Delete post
 */
export async function deletePost(postId: string): Promise<void> {
  await delay(300);
}

/**
 * Get about content
 */
export async function getAboutContent(): Promise<AboutContent> {
  await delay(300);
  return mockAboutContent;
}

/**
 * Update about content
 */
export async function updateAboutContent(content: AboutContent): Promise<AboutContent> {
  await delay(500);
  return content;
}

/**
 * Get working hours
 */
export async function getWorkingHours(): Promise<WorkingHours[]> {
  await delay(300);
  return mockWorkingHours;
}

/**
 * Update working hours
 */
export async function updateWorkingHours(hours: WorkingHours[]): Promise<WorkingHours[]> {
  await delay(500);
  return hours;
}

/**
 * Get system settings
 */
export async function getSystemSettings(): Promise<SystemSettings> {
  await delay(300);
  return mockSystemSettings;
}

/**
 * Update system settings
 */
export async function updateSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
  await delay(500);
  return settings;
}

/**
 * Update service
 */
export async function updateService(service: Service): Promise<Service> {
  await delay(400);
  return service;
}

/**
 * Mock login function
 */
export async function login(email: string, password: string): Promise<{ success: boolean; user?: { name: string; email: string } }> {
  await delay(800);
  
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
 */
export async function logout(): Promise<void> {
  await delay(300);
}
