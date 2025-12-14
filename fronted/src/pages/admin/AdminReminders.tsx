import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getReminders, sendTestReminder } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Reminder } from '@/types';
import { Bell, Send } from 'lucide-react';

export default function AdminReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => { getReminders().then(setReminders); }, []);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const handleTest = async (id: string) => {
    toast({ title: 'שולח תזכורת בדיקה...' });
    await sendTestReminder(id);
    toast({ title: 'נשלח בהצלחה!' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">תזכורות</h1>
        
        <div className="grid gap-4">
          {reminders.map(r => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{r.title}</CardTitle>
                    <CardDescription>שליחה דרך: {r.sendVia === 'both' ? 'טלפון ואימייל' : r.sendVia === 'phone' ? 'טלפון' : 'אימייל'}</CardDescription>
                  </div>
                </div>
                <Switch checked={r.enabled} onCheckedChange={() => toggleReminder(r.id)} />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{r.message}</p>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => handleTest(r.id)}>
                  <Send className="h-4 w-4" />שליחת בדיקה
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
