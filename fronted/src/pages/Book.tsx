import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { TimeSlotGrid } from '@/components/ui/time-slot-grid';
import { FormField } from '@/components/ui/form-field';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { getServices, getAvailableSlots, createAppointment } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Service, TimeSlot } from '@/types';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { User, Phone, Mail } from 'lucide-react';

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      setSlotsLoading(true);
      getAvailableSlots(format(selectedDate, 'yyyy-MM-dd'), selectedService)
        .then(setSlots)
        .finally(() => setSlotsLoading(false));
    }
  }, [selectedDate, selectedService]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'שדה חובה';
    if (!form.phone.trim()) e.phone = 'שדה חובה';
    if (!form.email.trim()) e.email = 'שדה חובה';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'אימייל לא תקין';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const apt = await createAppointment({
        serviceId: selectedService,
        date: format(selectedDate!, 'yyyy-MM-dd'),
        time: selectedTime!,
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
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

  return (
    <PublicLayout>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <SectionTitle title="קביעת תור" subtitle="בחרי שירות, תאריך ושעה" />
          
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>{s}</div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <label className="block text-sm font-medium mb-2">בחרי שירות</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger><SelectValue placeholder="בחרי שירות" /></SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name} - ₪{s.price}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                  locale={he}
                  disabled={(d) => d < new Date()}
                  className="rounded-xl border bg-card p-3 pointer-events-auto"
                />
              </div>
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium mb-3">שעות פנויות - {format(selectedDate, 'dd/MM/yyyy')}</label>
                  <TimeSlotGrid slots={slots} selectedTime={selectedTime} onSelect={setSelectedTime} loading={slotsLoading} />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <FormField label="שם מלא" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} required icon={<User className="h-4 w-4" />} />
              <FormField label="טלפון" name="phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} required icon={<Phone className="h-4 w-4" />} />
              <FormField label="אימייל" name="email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} required icon={<Mail className="h-4 w-4" />} />
            </div>
          )}

          <div className="flex gap-4 mt-10">
            {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>חזרה</Button>}
            {step < 3 ? (
              <Button className="flex-1" onClick={() => setStep(step + 1)} disabled={!canProceed()}>המשך</Button>
            ) : (
              <Button className="flex-1" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <LoadingSpinner size="sm" /> : 'קבעי תור'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
