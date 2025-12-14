import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSubscribers } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Subscriber } from '@/types';
import { Copy, Download } from 'lucide-react';

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getSubscribers().then(setSubscribers).finally(() => setLoading(false)); }, []);

  const copyEmails = () => {
    const emails = subscribers.map(s => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast({ title: 'הועתק!', description: `${subscribers.length} כתובות אימייל הועתקו` });
  };

  const exportCsv = () => {
    const csv = 'email,signupDate\n' + subscribers.map(s => `${s.email},${s.signupDate}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subscribers.csv';
    a.click();
    toast({ title: 'הקובץ הורד בהצלחה' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">רשימת תפוצה</h1>
            <p className="text-muted-foreground">{subscribers.length} נרשמים</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={copyEmails}><Copy className="h-4 w-4" />העתקת כל המיילים</Button>
            <Button variant="outline" className="gap-2" onClick={exportCsv}><Download className="h-4 w-4" />ייצוא CSV</Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border">
          <Table>
            <TableHeader><TableRow><TableHead>אימייל</TableHead><TableHead>תאריך הרשמה</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={2} className="text-center py-8">טוען...</TableCell></TableRow>
              ) : subscribers.length === 0 ? (
                <TableRow><TableCell colSpan={2} className="text-center py-8 text-muted-foreground">אין נרשמים</TableCell></TableRow>
              ) : subscribers.map(s => (
                <TableRow key={s.id}><TableCell>{s.email}</TableCell><TableCell>{s.signupDate}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
