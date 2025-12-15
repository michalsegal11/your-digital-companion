import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getAppointments, updateAppointmentStatus, cancelAppointment } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Appointment } from '@/types';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export default function AdminCalendar() {
  const [view, setView] = useState<'day' | 'week' | 'month'>('day');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const getRange = () => {
    const now = new Date();
    if (view === 'day') return { start: format(startOfDay(now), 'yyyy-MM-dd'), end: format(endOfDay(now), 'yyyy-MM-dd') };
    if (view === 'week') return { start: format(startOfWeek(now), 'yyyy-MM-dd'), end: format(endOfWeek(now), 'yyyy-MM-dd') };
    return { start: format(startOfMonth(now), 'yyyy-MM-dd'), end: format(endOfMonth(now), 'yyyy-MM-dd') };
  };

  useEffect(() => {
    setLoading(true);
    getAppointments(getRange()).then(setAppointments).finally(() => setLoading(false));
  }, [view]);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast({ title: 'הסטטוס עודכן' });
    } catch { toast({ title: 'שגיאה', variant: 'destructive' }); }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
      toast({ title: 'התור בוטל' });
    } catch { toast({ title: 'שגיאה', variant: 'destructive' }); }
  };

  const statusBadge = (status: Appointment['status']) => {
    const colors = { scheduled: 'bg-primary/10 text-primary', arrived: 'bg-success/10 text-success', completed: 'bg-muted text-muted-foreground', cancelled: 'bg-destructive/10 text-destructive' };
    const labels = { scheduled: 'מתוכנן', arrived: 'הגיעה', completed: 'הושלם', cancelled: 'בוטל' };
    return <Badge variant="outline" className={colors[status]}>{labels[status]}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">יומן תורים</h1>
          <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
            <TabsList><TabsTrigger value="day">יום</TabsTrigger><TabsTrigger value="week">שבוע</TabsTrigger><TabsTrigger value="month">חודש</TabsTrigger></TabsList>
          </Tabs>
        </div>

        <div className="bg-card rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>שם</TableHead><TableHead>תאריך</TableHead><TableHead>שעה</TableHead><TableHead>שירות</TableHead><TableHead>סטטוס</TableHead><TableHead>פעולות</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">טוען...</TableCell></TableRow>
              ) : appointments.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">אין תורים</TableCell></TableRow>
              ) : appointments.map(apt => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.customerName}</TableCell>
                  <TableCell>{apt.date}</TableCell>
                  <TableCell>{apt.time}</TableCell>
                  <TableCell>{apt.serviceName}</TableCell>
                  <TableCell>{statusBadge(apt.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {apt.status === 'scheduled' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleStatusChange(apt.id, 'arrived')}>הגיעה</Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleCancel(apt.id)}>ביטול</Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
