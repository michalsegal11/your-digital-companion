import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileBarChart, 
  Mail, 
  Bell,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'לוח בקרה' },
  { to: '/admin/calendar', icon: Calendar, label: 'יומן תורים' },
  { to: '/admin/customers', icon: Users, label: 'לקוחות' },
  { to: '/admin/reports', icon: FileBarChart, label: 'דוחות' },
  { to: '/admin/subscribers', icon: Mail, label: 'רשימת תפוצה' },
  { to: '/admin/reminders', icon: Bell, label: 'תזכורות' },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-l border-sidebar-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">ש</span>
          </div>
          <div>
            <span className="text-lg font-semibold text-sidebar-foreground">שירה סטייל</span>
            <p className="text-xs text-muted-foreground">ניהול</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-soft'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
