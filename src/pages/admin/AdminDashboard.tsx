import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { getKPIData } from '@/lib/api';
import type { KPIData } from '@/types';
import { Calendar, Users, Mail, Scissors, TrendingUp, FileBarChart } from 'lucide-react';

export default function AdminDashboard() {
  const [kpi, setKpi] = useState<KPIData | null>(null);

  useEffect(() => {
    getKPIData().then(setKpi);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">לוח בקרה</h1>
          <p className="text-muted-foreground">סקירה כללית</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="תורים היום" value={kpi?.todayAppointments ?? '-'} icon={<Calendar className="h-6 w-6" />} />
          <StatCard title="תורים השבוע" value={kpi?.weekAppointments ?? '-'} icon={<Calendar className="h-6 w-6" />} />
          <StatCard title="נרשמים לתפוצה" value={kpi?.subscribersCount ?? '-'} icon={<Mail className="h-6 w-6" />} />
          <StatCard title="סירוקים החודש" value={kpi?.monthlyCombings ?? '-'} trend={kpi?.combingsTrend} icon={<Scissors className="h-6 w-6" />} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Button asChild size="lg" className="h-16 gap-2">
            <Link to="/admin/calendar"><Calendar className="h-5 w-5" />ליומן תורים</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16 gap-2">
            <Link to="/admin/customers"><Users className="h-5 w-5" />לקוחות</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16 gap-2">
            <Link to="/admin/reports"><FileBarChart className="h-5 w-5" />דוחות</Link>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
