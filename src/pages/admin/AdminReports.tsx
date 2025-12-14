import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getIncomeExpenses, getAllCustomerReports } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { CustomerReport } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

export default function AdminReports() {
  const [year, setYear] = useState('2024');
  const [financeData, setFinanceData] = useState<{ month: string; income: number; expense: number }[]>([]);
  const [customerReports, setCustomerReports] = useState<CustomerReport[]>([]);

  useEffect(() => { getIncomeExpenses(year).then(setFinanceData); getAllCustomerReports().then(setCustomerReports); }, [year]);

  const handleDownload = () => toast({ title: 'מייצר דוח PDF...', description: 'הדוח יהיה מוכן בקרוב' });

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">דוחות</h1>
          <div className="flex gap-4">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="2024">2024</SelectItem><SelectItem value="2023">2023</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={handleDownload}><Download className="h-4 w-4" />הורדת PDF</Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="font-semibold mb-4">הכנסות מול הוצאות - {year}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" name="הכנסות" fill="hsl(142 70% 45%)" />
                <Bar dataKey="expense" name="הוצאות" fill="hsl(0 84% 60%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border">
          <div className="p-4 border-b"><h2 className="font-semibold">סיכום עלויות תיקונים ללקוח</h2></div>
          <Table>
            <TableHeader><TableRow><TableHead>לקוח</TableHead><TableHead>מספר תיקונים</TableHead><TableHead>עלות כוללת</TableHead></TableRow></TableHeader>
            <TableBody>
              {customerReports.map(r => (
                <TableRow key={r.customerId}>
                  <TableCell className="font-medium">{r.customerName}</TableCell>
                  <TableCell>{r.repairsCount}</TableCell>
                  <TableCell>₪{r.totalRepairsCost}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
