import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">ש</span>
              </div>
              <span className="text-xl font-semibold text-foreground">שירה סטייל</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              מומחית להתאמה ועיצוב פאות. שירות אישי ומקצועי ברמה הגבוהה ביותר.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">יצירת קשר</h3>
            <div className="space-y-3">
              <a href="tel:050-1234567" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Phone className="h-4 w-4" />
                050-1234567
              </a>
              <a href="mailto:info@shirastyle.co.il" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                <Mail className="h-4 w-4" />
                info@shirastyle.co.il
              </a>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4" />
                תל אביב
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">קישורים מהירים</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                בית
              </Link>
              <Link to="/book" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                קביעת תור
              </Link>
              <Link to="/admin/login" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                כניסת מנהלת
              </Link>
            </div>
            
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} שירה סטייל. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
