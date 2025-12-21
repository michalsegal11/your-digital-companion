import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { GlassCard } from '@/components/ui/GlassCard';
import { ReminderPanel } from '@/components/ui/ReminderPanel';
import { getServices, getAvailableSlots, createAppointment } from '@/lib/api';
import { getHebrewDateLabel, getWorkingHoursDescription, hasEveningShift } from '@/lib/scheduling';
import { toast } from '@/hooks/use-toast';
import type { Service, TimeSlot, ReminderPreference } from '@/types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { User, Phone, Mail, Clock, Calendar as CalendarIcon, Sparkles, Moon, Sun, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Reminder preferences
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderChannels, setReminderChannels] = useState({ sms: false, email: true });

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      setSlotsLoading(true);
      setSelectedTime(null);
      getAvailableSlots(format(selectedDate, 'yyyy-MM-dd'), selectedService.id)
        .then(setSlots)
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedDate, selectedService]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'שדה חובה';
    if (!form.phone.trim()) e.phone = 'שדה חובה';
    else if (!/^0\d{1,2}-?\d{7}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'מספר טלפון לא תקין';
    if (!form.email.trim()) e.email = 'שדה חובה';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'אימייל לא תקין';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    
    const reminderPreference: ReminderPreference = {
      enabled: reminderEnabled,
      channels: reminderChannels,
    };
    
    try {
      const apt = await createAppointment({
        serviceId: selectedService!.id,
        date: format(selectedDate!, 'yyyy-MM-dd'),
        time: selectedTime!,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        reminderPreference,
      });
      navigate('/book/success', { state: { appointment: apt } });
    } catch {
      toast({ title: 'שגיאה בקביעת התור', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedDate && !!selectedTime;
    return true;
  };

  const morningSlots = slots.filter(s => s.shift === 'morning');
  const eveningSlots = slots.filter(s => s.shift === 'evening');

  return (
    <PublicLayout>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionTitle title="קביעת תור" subtitle="בחרי שירות, תאריך ושעה" />
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[
              { num: 1, label: 'שירות' },
              { num: 2, label: 'תאריך ושעה' },
              { num: 3, label: 'פרטים' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  step >= s.num 
                    ? 'bg-brand-700 text-white shadow-lg' 
                    : 'bg-neutral-200 text-neutral-500'
                )}>
                  {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                </div>
                <span className={cn(
                  'mr-2 text-sm hidden sm:block',
                  step >= s.num ? 'text-brand-700 font-medium' : 'text-neutral-400'
                )}>
                  {s.label}
                </span>
                {i < 2 && <div className={cn(
                  'w-12 h-0.5 mx-2',
                  step > s.num ? 'bg-brand-700' : 'bg-neutral-200'
                )} />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-medium text-brand-800 mb-4">בחרי שירות</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {services.map((service) => (
                  <GlassCard
                    key={service.id}
                    className={cn(
                      'p-6 cursor-pointer transition-all hover:scale-[1.02]',
                      selectedService?.id === service.id 
                        ? 'ring-2 ring-brand-700 bg-pink-50' 
                        : 'hover:bg-neutral-50'
                    )}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-brand-800 text-lg">{service.name}</h4>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration} דקות</span>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-brand-700">
                        ₪{service.price}
                      </div>
                    </div>
                    {selectedService?.id === service.id && (
                      <div className="mt-3 flex items-center gap-2 text-brand-700 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>נבחר</span>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <GlassCard className="p-6">
                <h3 className="text-lg font-medium text-brand-800 mb-4 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  בחרי תאריך
                </h3>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                    locale={he}
                    disabled={(d) => {
                      const day = d.getDay();
                      // Disable past dates, Friday (5), Saturday (6)
                      return d < new Date(new Date().setHours(0,0,0,0)) || day === 5 || day === 6;
                    }}
                    className="rounded-xl border-0 bg-transparent pointer-events-auto"
                  />
                </div>
                
                {selectedDate && (
                  <div className="mt-4 p-4 bg-pink-50 rounded-xl text-center">
                    <div className="text-brand-800 font-medium">
                      {format(selectedDate, 'EEEE, d בMMMM yyyy', { locale: he })}
                    </div>
                    <div className="text-pink-600 font-semibold mt-1">
                      {getHebrewDateLabel(selectedDate)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      שעות פעילות: {getWorkingHoursDescription(selectedDate)}
                    </div>
                  </div>
                )}
              </GlassCard>

              {selectedDate && (
                <GlassCard className="p-6">
                  <h3 className="text-lg font-medium text-brand-800 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    בחרי שעה
                  </h3>
                  
                  {slotsLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      אין שעות פנויות ביום זה
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Morning slots */}
                      {morningSlots.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-brand-700">
                            <Sun className="h-4 w-4" />
                            <span>משמרת בוקר (09:30 - 14:45)</span>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {morningSlots.map((slot) => (
                              <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={cn(
                                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                                  !slot.available && 'opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400',
                                  slot.available && selectedTime === slot.time && 'bg-brand-700 text-white shadow-lg',
                                  slot.available && selectedTime !== slot.time && 'bg-white border border-neutral-200 hover:border-brand-700 hover:bg-pink-50'
                                )}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evening slots */}
                      {eveningSlots.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-pink-600">
                            <Moon className="h-4 w-4" />
                            <span>משמרת ערב (21:00 - 23:00)</span>
                          </div>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {eveningSlots.map((slot) => (
                              <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={cn(
                                  'py-2 px-3 rounded-lg text-sm font-medium transition-all',
                                  !slot.available && 'opacity-40 cursor-not-allowed bg-neutral-100 text-neutral-400',
                                  slot.available && selectedTime === slot.time && 'bg-pink-500 text-white shadow-lg',
                                  slot.available && selectedTime !== slot.time && 'bg-white border border-neutral-200 hover:border-pink-500 hover:bg-pink-50'
                                )}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          )}

          {/* Step 3: Customer Details + Reminder */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Summary */}
              <GlassCard className="p-6 bg-gradient-to-br from-pink-50 to-neutral-50">
                <h3 className="text-lg font-medium text-brand-800 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-pink-500" />
                  סיכום התור
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">שירות:</span>
                    <p className="font-medium text-brand-800">{selectedService?.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">משך:</span>
                    <p className="font-medium text-brand-800">{selectedService?.duration} דקות</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">תאריך:</span>
                    <p className="font-medium text-brand-800">
                      {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
                    </p>
                    <p className="text-pink-600 text-xs">
                      {selectedDate && getHebrewDateLabel(selectedDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">שעה:</span>
                    <p className="font-medium text-brand-800">{selectedTime}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Customer Details */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-medium text-brand-800 mb-4">פרטי לקוחה</h3>
                <div className="space-y-4">
                  <FormField 
                    label="שם מלא" 
                    name="name" 
                    value={form.name} 
                    onChange={(v) => setForm({ ...form, name: v })} 
                    error={errors.name} 
                    required 
                    icon={<User className="h-4 w-4" />} 
                  />
                  <FormField 
                    label="טלפון" 
                    name="phone" 
                    type="tel" 
                    value={form.phone} 
                    onChange={(v) => setForm({ ...form, phone: v })} 
                    error={errors.phone} 
                    required 
                    icon={<Phone className="h-4 w-4" />}
                    placeholder="050-1234567"
                  />
                  <FormField 
                    label="אימייל" 
                    name="email" 
                    type="email" 
                    value={form.email} 
                    onChange={(v) => setForm({ ...form, email: v })} 
                    error={errors.email} 
                    required 
                    icon={<Mail className="h-4 w-4" />} 
                  />
                </div>
              </GlassCard>

              {/* Reminder Panel */}
              <ReminderPanel
                enabled={reminderEnabled}
                onEnabledChange={setReminderEnabled}
                channels={reminderChannels}
                onChannelChange={(channel, value) => 
                  setReminderChannels(prev => ({ ...prev, [channel]: value }))
                }
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-10">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="flex-1 sm:flex-none"
              >
                חזרה
              </Button>
            )}
            {step < 3 ? (
              <Button 
                className="flex-1 bg-brand-700 hover:bg-brand-800" 
                onClick={() => setStep(step + 1)} 
                disabled={!canProceed()}
              >
                המשך
              </Button>
            ) : (
              <Button 
                className="flex-1 bg-brand-700 hover:bg-brand-800" 
                onClick={handleSubmit} 
                disabled={submitting}
              >
                {submitting ? <LoadingSpinner size="sm" /> : 'קבעי תור'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
