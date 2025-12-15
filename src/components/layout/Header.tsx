import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isHome ? 'bg-transparent' : 'bg-background/95 backdrop-blur-md border-b border-border'
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">ש</span>
          </div>
          <span className={`text-xl font-semibold ${isHome ? 'text-primary-foreground' : 'text-foreground'}`}>
            שירה סטייל
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isHome ? 'text-primary-foreground/90 hover:text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            בית
          </Link>
          <Link 
            to="/book" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isHome ? 'text-primary-foreground/90 hover:text-primary-foreground' : 'text-muted-foreground'
            }`}
          >
            קביעת תור
          </Link>
        </nav>

        <Button asChild className="gap-2">
          <Link to="/book">
            <Calendar className="h-4 w-4" />
            קביעת תור
          </Link>
        </Button>
      </div>
    </header>
  );
}
