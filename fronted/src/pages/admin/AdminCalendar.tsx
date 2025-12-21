import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { GlassCard } from '@/components/ui/GlassCard';
import { getAppointments, updateAppointmentStatus, cancelAppointment, getServices, getAvailableSlots, updateAppointment } from '@/lib/api';
import { getHebrewDateLabel } from '@/lib/scheduling';
import { toast } from '@/hooks/use-toast';
import type { Appointment, Service, TimeSlot } from '@/types';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { he } from 'date-fns/locale';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon, Edit2, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminCalendar() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit modal state
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editService, setEditService] = useState('');
  const [editDate, setEditDate] = useState<Date | undefined>();
  const [editTime, setEditTime] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [editLoading, setEditLoading] = useState(false);

  // Generate month options for dropdown (current + 12 months ahead)
  const monthOptions = Array.from({ length: 13 }, (_, i) => {
    const date = addMonths(new Date(), i);
    return {
      value: format(date, 'yyyy-MM'),
      label: format(date, 'MMMM yyyy', { locale: he }),
    };
  });

  const getRange = () => {
    if (view === 'day') {
      return { 
        start: format(startOfDay(currentDate), 'yyyy-MM-dd'), 
        end: format(endOfDay(currentDate), 'yyyy-MM-dd') 
      };
    }
    if (view === 'week') {
      return { 
        start: format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd'), 
        end: format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'yyyy-MM-dd') 
      };
    }
    return { 
      start: format(startOfMonth(currentDate), 'yyyy-MM-dd'), 
      end: format(endOfMonth(currentDate), 'yyyy-MM-dd') 
    };
  };

  useEffect(() => {
    setLoading(true);
    getAppointments(getRange())
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, [view, currentDate]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  // Load available slots when editing
  useEffect(() => {
    if (editingAppointment && editDate && editService) {
      getAvailableSlots(format(editDate, 'yyyy-MM-dd'), editService)
        .then(setAvailableSlots);
    }
  }, [editDate, editService, editingAppointment]);

  const handlePrev = () => {
    if (view === 'day') setCurrentDate(d => new Date(d.setDate(d.getDate() - 1)));
    else if (view === 'week') setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
    else setCurrentDate(d => subMonths(d, 1));
  };

  const handleNext = () => {
    if (view === 'day') setCurrentDate(d => new Date(d.setDate(d.getDate() + 1)));
    else if (view === 'week') setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
    else setCurrentDate(d => addMonths(d, 1));
  };

  const handleToday = () => setCurrentDate(new Date());

  const handleMonthJump = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast({ title: 'הסטטוס עודכן' });
    } catch { 
      toast({ title: 'שגיאה', variant: 'destructive' }); 
    }
  };

  const handleCancel = async (id: string) => {
    const result = await cancelAppointment(id);
    if (result.success) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
      toast({ title: 'התור בוטל' });
    } else {
      toast({ title: result.error || 'שגיאה', variant: 'destructive' });
    }
  };

  const openEditModal = (apt: Appointment) => {
    setEditingAppointment(apt);
    setEditService(apt.serviceId);
    setEditDate(new Date(apt.date));
    setEditTime(apt.time);
  };

  const handleEditSave = async () => {
    if (!editingAppointment || !editDate || !editTime) return;
    
    setEditLoading(true);
    try {
      const updated = await updateAppointment(editingAppointment.id, {
        serviceId: editService,
        date: format(editDate, 'yyyy-MM-dd'),
        time: editTime,
      });
      
      setAppointments(prev => prev.map(a => 
        a.id === editingAppointment.id ? updated : a
      ));
      setEditingAppointment(null);
      toast({ title: 'התור עודכן בהצלחה' });
    } catch {
      toast({ title: 'שגיאה בעדכון', variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  const statusBadge = (status: Appointment['status']) => {
    const config = {
      scheduled: { className: 'bg-brand-100 text-brand-700 border-brand-200', label: 'מתוכנן', icon: Clock },
      arrived: { className: 'bg-green-100 text-green-700 border-green-200', label: 'הגיעה', icon: CheckCircle },
      completed: { className: 'bg-neutral-100 text-neutral-600 border-neutral-200', label: 'הושלם', icon: CheckCircle },
      cancelled: { className: 'bg-red-100 text-red-700 border-red-200', label: 'בוטל', icon: X },
    };
    const { className, label, icon: Icon } = config[status];
    return (
      <Badge variant="outline" className={cn('flex items-center gap-1', className)}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  const getDateRangeLabel = () => {
    if (view === 'day') {
      return (
        <div className="text-center">
          <div className="font-semibold">{format(currentDate, 'EEEE, d בMMMM yyyy', { locale: he })}</div>
          <div className="text-sm text-pink-600">{getHebrewDateLabel(currentDate)}</div>
        </div>
      );
    }
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return `${format(start, 'd/M')} - ${format(end, 'd/M/yyyy')}`;
    }
    return format(currentDate, 'MMMM yyyy', { locale: he });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-brand-800">יומן תורים</h1>
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList className="bg-neutral-100">
              <TabsTrigger value="day">יום</TabsTrigger>
              <TabsTrigger value="week">שבוע</TabsTrigger>
              <TabsTrigger value="month">חודש</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Navigation Controls */}
        <GlassCard className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrev}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleToday}>
                החודש
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-lg font-medium text-brand-800">
              {getDateRangeLabel()}
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={format(currentDate, 'yyyy-MM')} 
                onValueChange={handleMonthJump}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </GlassCard>

        {/* Appointments Table */}
        <GlassCard className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50">
                <TableHead className="font-semibold">שם</TableHead>
                <TableHead className="font-semibold">תאריך</TableHead>
                <TableHead className="font-semibold">תאריך עברי</TableHead>
                <TableHead className="font-semibold">שעה</TableHead>
                <TableHead className="font-semibold">שירות</TableHead>
                <TableHead className="font-semibold">סטטוס</TableHead>
                <TableHead className="font-semibold">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <div className="animate-spin h-5 w-5 border-2 border-brand-700 border-t-transparent rounded-full" />
                      טוען...
                    </div>
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 text-neutral-300" />
                      <span>אין תורים בטווח התאריכים הנבחר</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : appointments.map(apt => (
                <TableRow key={apt.id} className="hover:bg-neutral-50/50">
                  <TableCell className="font-medium">{apt.customerName}</TableCell>
                  <TableCell>{format(new Date(apt.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="text-pink-600">{apt.hebrewDate || getHebrewDateLabel(new Date(apt.date))}</TableCell>
                  <TableCell>{apt.time}</TableCell>
                  <TableCell>{apt.serviceName}</TableCell>
                  <TableCell>{statusBadge(apt.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {apt.status === 'scheduled' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                            onClick={() => openEditModal(apt)}
                          >
                            <Edit2 className="h-3 w-3" />
                            שינוי
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(apt.id, 'arrived')}
                          >
                            <CheckCircle className="h-3 w-3" />
                            הגיעה
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancel(apt.id)}
                          >
                            <X className="h-3 w-3" />
                            ביטול
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </GlassCard>

        {/* Cancellation Alert Info */}
        <GlassCard className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">התראות ביטול</h4>
              <p className="text-sm text-amber-700">
                כאשר לקוחה מבטלת תור, תקבלי התראה מיידית עם פרטי הלקוחה, התאריך והשירות.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Edit Appointment Modal */}
      <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>עריכת תור - {editingAppointment?.customerName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">שירות</label>
              <Select value={editService} onValueChange={setEditService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.duration} דקות)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">תאריך</label>
              <Calendar
                mode="single"
                selected={editDate}
                onSelect={setEditDate}
                locale={he}
                disabled={(d) => d < new Date() || d.getDay() === 5 || d.getDay() === 6}
                className="rounded-lg border pointer-events-auto"
              />
              {editDate && (
                <p className="text-sm text-pink-600 mt-2">
                  {getHebrewDateLabel(editDate)}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">שעה</label>
              <Select value={editTime} onValueChange={setEditTime}>
                <SelectTrigger>
                  <SelectValue placeholder="בחרי שעה" />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots
                    .filter(s => s.available || s.time === editingAppointment?.time)
                    .map(slot => (
                      <SelectItem key={slot.time} value={slot.time}>
                        {slot.time} {slot.shift === 'evening' ? '(ערב)' : ''}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAppointment(null)}>
              ביטול
            </Button>
            <Button 
              onClick={handleEditSave} 
              disabled={editLoading}
              className="bg-brand-700 hover:bg-brand-800"
            >
              {editLoading ? 'שומר...' : 'שמירה'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
