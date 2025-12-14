import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCustomers, getCustomerRepairs, getCustomerCombings } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { Customer, Repair, Combing } from '@/types';
import { Search, FileText } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Customer | null>(null);
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [combings, setCombings] = useState<Combing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getCustomers().then(setCustomers).finally(() => setLoading(false)); }, []);

  const openDetails = async (c: Customer) => {
    setSelected(c);
    const [r, co] = await Promise.all([getCustomerRepairs(c.id), getCustomerCombings(c.id)]);
    setRepairs(r);
    setCombings(co);
  };

  const filtered = customers.filter(c => c.name.includes(search) || c.phone.includes(search) || c.email.includes(search));

  const generatePdf = () => {
    toast({ title: 'מייצר דוח PDF...', description: 'הדוח יהיה מוכן בקרוב' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">לקוחות</h1>
          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="חיפוש..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
          </div>
        </div>

        <div className="bg-card rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow><TableHead>שם</TableHead><TableHead>טלפון</TableHead><TableHead>אימייל</TableHead><TableHead>אחריות</TableHead><TableHead>הערות</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">טוען...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">אין לקוחות</TableCell></TableRow>
              ) : filtered.map(c => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(c)}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.warrantyStatus === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}>
                      {c.warrantyStatus === 'active' ? 'פעילה' : 'פג תוקף'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">טלפון:</span> {selected.phone}</div>
                <div><span className="text-muted-foreground">אימייל:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">תאריך רכישה:</span> {selected.purchaseDate || '-'}</div>
                <div><span className="text-muted-foreground">סיום אחריות:</span> {selected.warrantyEndDate || '-'}</div>
                <div><span className="text-muted-foreground">סירוקים חינם:</span> {selected.freeCombingsUsed}/{selected.freeCombingsMonths} חודשים</div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">תיקונים ({repairs.length})</h4>
                {repairs.length === 0 ? <p className="text-muted-foreground text-sm">אין תיקונים</p> : (
                  <div className="space-y-1 text-sm">{repairs.map(r => <div key={r.id}>{r.date} - {r.description} {r.isFree ? '(חינם)' : `₪${r.cost}`}</div>)}</div>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">סירוקים ({combings.length})</h4>
                {combings.length === 0 ? <p className="text-muted-foreground text-sm">אין סירוקים</p> : (
                  <div className="space-y-1 text-sm">{combings.map(co => <div key={co.id}>{co.date} {co.isFree ? '(חינם)' : ''}</div>)}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">הוספת תיקון</Button>
                <Button variant="outline" size="sm">הוספת סירוק</Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={generatePdf}><FileText className="h-4 w-4" />הפקת דוח PDF</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
