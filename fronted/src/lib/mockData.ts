import type { 
  Customer, 
  Service, 
  Appointment, 
  Subscriber, 
  FinanceRecord,
  Repair,
  Combing,
  WorkingHours,
  Reminder,
  KPIData,
  CustomerReport,
  Notification,
  Post,
  AboutContent,
  SystemSettings
} from '@/types';

// CRITICAL: Service durations must match scheduling rules
export const mockServices: Service[] = [
  { id: 'siruq', name: 'סירוק', duration: 15, price: 150, isActive: true },
  { id: 'tiqun', name: 'תיקון', duration: 15, price: 300, isActive: true },
  { id: 'purchase', name: 'קניית פאה', duration: 60, price: 3500, isActive: true },
  { id: 'consultation', name: 'ייעוץ', duration: 30, price: 200, isActive: true },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'שרה כהן',
    phone: '050-1234567',
    email: 'sara@example.com',
    purchaseDate: '2024-06-15',
    warrantyStatus: 'active',
    warrantyEndDate: '2025-06-15',
    freeCombingsMonths: 6,
    freeCombingsUsed: 3,
    notes: 'לקוחה קבועה, מעדיפה תורים בבוקר',
    createdAt: '2024-06-15',
  },
  {
    id: '2',
    name: 'רחל לוי',
    phone: '052-9876543',
    email: 'rachel@example.com',
    purchaseDate: '2024-01-20',
    warrantyStatus: 'active',
    warrantyEndDate: '2025-01-20',
    freeCombingsMonths: 12,
    freeCombingsUsed: 8,
    notes: 'לקוחה מרוחקת - הארכת סירוקים חינם ל-12 חודשים',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'מרים אברהם',
    phone: '054-5555555',
    email: 'miriam@example.com',
    purchaseDate: '2023-03-10',
    warrantyStatus: 'expired',
    warrantyEndDate: '2024-03-10',
    freeCombingsMonths: 6,
    freeCombingsUsed: 6,
    notes: '',
    createdAt: '2023-03-10',
  },
];

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'שרה כהן',
    customerPhone: '050-1234567',
    customerEmail: 'sara@example.com',
    serviceId: 'siruq',
    serviceName: 'סירוק',
    date: today,
    time: '10:00',
    hebrewDate: 'י״ב כסלו',
    status: 'scheduled',
    reminderPreference: { enabled: true, channels: { email: true, sms: false } },
    reminderSent: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'רחל לוי',
    customerPhone: '052-9876543',
    customerEmail: 'rachel@example.com',
    serviceId: 'tiqun',
    serviceName: 'תיקון',
    date: today,
    time: '14:00',
    hebrewDate: 'י״ב כסלו',
    status: 'scheduled',
    reminderPreference: { enabled: true, channels: { email: false, sms: true } },
    reminderSent: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'מרים אברהם',
    customerPhone: '054-5555555',
    customerEmail: 'miriam@example.com',
    serviceId: 'purchase',
    serviceName: 'קניית פאה',
    date: tomorrow,
    time: '11:00',
    hebrewDate: 'י״ג כסלו',
    status: 'scheduled',
    reminderPreference: { enabled: true, channels: { email: true, sms: true } },
    reminderSent: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    customerId: '1',
    customerName: 'שרה כהן',
    customerPhone: '050-1234567',
    customerEmail: 'sara@example.com',
    serviceId: 'siruq',
    serviceName: 'סירוק',
    date: nextWeek,
    time: '21:30',
    hebrewDate: 'י״ט כסלו',
    status: 'scheduled',
    reminderPreference: { enabled: true, channels: { email: true, sms: false } },
    reminderSent: false,
    createdAt: new Date().toISOString(),
  },
];

export const mockRepairs: Repair[] = [
  { id: '1', customerId: '1', date: '2024-08-15', description: 'תיקון תפר', cost: 0, isFree: true },
  { id: '2', customerId: '1', date: '2024-10-20', description: 'החלפת רשת', cost: 0, isFree: true },
  { id: '3', customerId: '2', date: '2024-09-05', description: 'תיקון בסיס', cost: 0, isFree: true },
  { id: '4', customerId: '3', date: '2024-11-10', description: 'תיקון שיער', cost: 150, isFree: false },
];

export const mockCombings: Combing[] = [
  { id: '1', customerId: '1', date: '2024-07-15', isFree: true },
  { id: '2', customerId: '1', date: '2024-08-20', isFree: true },
  { id: '3', customerId: '1', date: '2024-09-25', isFree: true },
  { id: '4', customerId: '2', date: '2024-02-10', isFree: true },
  { id: '5', customerId: '2', date: '2024-03-15', isFree: true },
];

export const mockSubscribers: Subscriber[] = [
  { id: '1', email: 'subscriber1@example.com', signupDate: '2024-10-01', consent: true },
  { id: '2', email: 'subscriber2@example.com', signupDate: '2024-10-15', consent: true },
  { id: '3', email: 'subscriber3@example.com', signupDate: '2024-11-01', consent: true },
  { id: '4', email: 'subscriber4@example.com', signupDate: '2024-11-10', consent: true },
  { id: '5', email: 'subscriber5@example.com', signupDate: '2024-12-01', consent: true },
];

export const mockFinanceRecords: FinanceRecord[] = [
  { id: '1', type: 'income', amount: 500, category: 'התאמה', description: 'התאמת פאה חדשה', date: '2024-01-15', customerId: '1' },
  { id: '2', type: 'income', amount: 150, category: 'סירוק', description: 'סירוק פאה', date: '2024-01-20', customerId: '2' },
  { id: '3', type: 'expense', amount: 200, category: 'חומרים', description: 'רכישת חומרים', date: '2024-01-25' },
  { id: '4', type: 'income', amount: 300, category: 'תיקון', description: 'תיקון פאה', date: '2024-02-10', customerId: '3' },
  { id: '5', type: 'expense', amount: 100, category: 'תחזוקה', description: 'תחזוקת ציוד', date: '2024-02-15' },
];

export const mockWorkingHours: WorkingHours[] = [
  { dayOfWeek: 0, dayName: 'ראשון', morningShift: { start: '09:30', end: '14:45', enabled: true }, isWorkingDay: true },
  { dayOfWeek: 1, dayName: 'שני', morningShift: { start: '09:30', end: '14:45', enabled: true }, eveningShift: { start: '21:00', end: '23:00', enabled: true }, isWorkingDay: true },
  { dayOfWeek: 2, dayName: 'שלישי', morningShift: { start: '09:30', end: '14:45', enabled: true }, isWorkingDay: true },
  { dayOfWeek: 3, dayName: 'רביעי', morningShift: { start: '09:30', end: '14:45', enabled: true }, eveningShift: { start: '21:00', end: '23:00', enabled: true }, isWorkingDay: true },
  { dayOfWeek: 4, dayName: 'חמישי', morningShift: { start: '09:30', end: '14:45', enabled: true }, isWorkingDay: true },
  { dayOfWeek: 5, dayName: 'שישי', morningShift: { start: '', end: '', enabled: false }, isWorkingDay: false },
  { dayOfWeek: 6, dayName: 'שבת', morningShift: { start: '', end: '', enabled: false }, isWorkingDay: false },
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    type: 'washing',
    title: 'תזכורת כביסת פאה',
    message: 'תזכורת: נא להביא את הפאה לכביסה לפני השעה 14:30 ביום שלפני התור',
    sendVia: 'both',
    enabled: true,
    sendBeforeDays: 1,
  },
  {
    id: '2',
    type: 'appointment',
    title: 'תזכורת תור',
    message: 'תזכורת: יש לך תור מחר בשעה {time}',
    sendVia: 'both',
    enabled: true,
    sendBeforeDays: 1,
  },
  {
    id: '3',
    type: 'holiday',
    title: 'תזכורת ערב חג',
    message: 'היי! ערב חג מתקרב - הזמן לסרק את הפאה 💇‍♀️',
    sendVia: 'both',
    enabled: true,
  },
];

export const mockKPIData: KPIData = {
  todayAppointments: 4,
  weekAppointments: 18,
  subscribersCount: 127,
  monthlyCombings: 23,
  combingsTrend: 12,
};

export const mockCustomerReports: CustomerReport[] = [
  {
    customerId: '1',
    customerName: 'שרה כהן',
    totalRepairsCost: 0,
    repairsCount: 2,
    monthlyBreakdown: [
      { month: '2024-08', cost: 0, count: 1 },
      { month: '2024-10', cost: 0, count: 1 },
    ],
  },
  {
    customerId: '2',
    customerName: 'רחל לוי',
    totalRepairsCost: 0,
    repairsCount: 1,
    monthlyBreakdown: [
      { month: '2024-09', cost: 0, count: 1 },
    ],
  },
  {
    customerId: '3',
    customerName: 'מרים אברהם',
    totalRepairsCost: 150,
    repairsCount: 1,
    monthlyBreakdown: [
      { month: '2024-11', cost: 150, count: 1 },
    ],
  },
];

export const mockIncomeExpensesByYear: Record<string, { month: string; income: number; expense: number }[]> = {
  '2024': [
    { month: 'ינואר', income: 4500, expense: 1200 },
    { month: 'פברואר', income: 5200, expense: 800 },
    { month: 'מרץ', income: 4800, expense: 1500 },
    { month: 'אפריל', income: 6100, expense: 900 },
    { month: 'מאי', income: 5500, expense: 1100 },
    { month: 'יוני', income: 4900, expense: 1300 },
    { month: 'יולי', income: 5800, expense: 700 },
    { month: 'אוגוסט', income: 6200, expense: 1000 },
    { month: 'ספטמבר', income: 5100, expense: 1400 },
    { month: 'אוקטובר', income: 5700, expense: 850 },
    { month: 'נובמבר', income: 6500, expense: 950 },
    { month: 'דצמבר', income: 7200, expense: 1100 },
  ],
  '2023': [
    { month: 'ינואר', income: 3800, expense: 1000 },
    { month: 'פברואר', income: 4200, expense: 750 },
    { month: 'מרץ', income: 4000, expense: 1200 },
    { month: 'אפריל', income: 4800, expense: 800 },
    { month: 'מאי', income: 4500, expense: 950 },
    { month: 'יוני', income: 4100, expense: 1100 },
    { month: 'יולי', income: 4700, expense: 600 },
    { month: 'אוגוסט', income: 5000, expense: 900 },
    { month: 'ספטמבר', income: 4300, expense: 1250 },
    { month: 'אוקטובר', income: 4900, expense: 700 },
    { month: 'נובמבר', income: 5200, expense: 850 },
    { month: 'דצמבר', income: 5800, expense: 1000 },
  ],
};

export const mockReviews = [
  {
    id: '1',
    name: 'שרה כ.',
    rating: 5,
    text: 'שירות מעולה! הפאה נראית טבעית לחלוטין והייעוץ היה מקצועי ואישי.',
    date: '2024-11-15',
  },
  {
    id: '2',
    name: 'רחל ל.',
    rating: 5,
    text: 'אני לקוחה כבר שנתיים ותמיד מרוצה. הסירוקים מושלמים!',
    date: '2024-10-28',
  },
  {
    id: '3',
    name: 'מרים א.',
    rating: 5,
    text: 'מקצועיות ברמה הגבוהה ביותר. ממליצה בחום!',
    date: '2024-10-10',
  },
  {
    id: '4',
    name: 'לאה ד.',
    rating: 5,
    text: 'יחס אישי ותוצאות מדהימות. תודה רבה!',
    date: '2024-09-22',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'cancellation',
    title: 'ביטול תור',
    message: 'שרה כהן ביטלה את התור לסירוק בתאריך 15/12/2024 בשעה 10:00',
    read: false,
    appointmentId: '1',
    customerId: '1',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'new_booking',
    title: 'תור חדש',
    message: 'רחל לוי קבעה תור לתיקון בתאריך 16/12/2024 בשעה 14:00',
    read: true,
    appointmentId: '2',
    customerId: '2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'שעות פעילות בחנוכה',
    content: 'לקוחות יקרות, בימי החנוכה נעבוד בשעות מורחבות. ניתן לקבוע תורים גם בשעות הערב.',
    date: '2024-12-10',
    isPublished: true,
  },
  {
    id: '2',
    title: 'מבצע סוף שנה',
    content: 'מבצע מיוחד לסוף שנה! 10% הנחה על כל שירותי הסירוק עד סוף דצמבר.',
    date: '2024-12-01',
    isPublished: true,
  },
];

export const mockAboutContent: AboutContent = {
  title: 'אודותיי',
  description: 'ברוכות הבאות! אני פאנית מקצועית עם ניסיון של למעלה מ-15 שנה בתחום. מתמחה בהתאמה אישית, סירוק מקצועי ותיקונים. אני מאמינה בשירות אישי, דיסקרטי ומקצועי לכל לקוחה.',
  highlights: [
    'ניסיון של 15+ שנים',
    'התאמה אישית לכל לקוחה',
    'שירות דיסקרטי ומקצועי',
    'אחריות על כל פאה',
    'סירוקים חינם לתקופה מוגדרת',
  ],
};

export const mockSystemSettings: SystemSettings = {
  cancellationDeadlineHours: 24,
  reminderDaysBefore: 1,
  timezone: 'Asia/Jerusalem',
};
