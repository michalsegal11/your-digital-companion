import { Link, useLocation } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import type { Appointment } from '@/types';

export default function BookSuccess() {
  const location = useLocation();
  const appointment = location.state?.appointment as Appointment | undefined;

  return (
    <PublicLayout>
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">התור נקבע בהצלחה!</h1>
          <p className="text-muted-foreground mb-8">נשמח לראותך</p>
          
          {appointment && (
            <div className="bg-card rounded-xl p-6 border border-border shadow-soft mb-8 text-right">
              <h3 className="font-semibold mb-4 text-lg">פרטי התור</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">שירות:</span> {appointment.serviceName}</p>
                <p><span className="text-muted-foreground">תאריך:</span> {appointment.date}</p>
                <p><span className="text-muted-foreground">שעה:</span> {appointment.time}</p>
                <p><span className="text-muted-foreground">שם:</span> {appointment.customerName}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="flex-1 gap-2">
              <Link to="/"><Home className="h-4 w-4" />חזרה לדף הבית</Link>
            </Button>
            <Button asChild className="flex-1 gap-2">
              <Link to="/book"><Calendar className="h-4 w-4" />קביעת תור נוסף</Link>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
