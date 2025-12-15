import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Phone, Mail, MapPin, Instagram, Facebook, Clock } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: 'טלפון', value: '052-1234567', href: 'tel:0521234567' },
  { icon: Mail, label: 'אימייל', value: 'info@shirastyle.co.il', href: 'mailto:info@shirastyle.co.il' },
  { icon: MapPin, label: 'כתובת', value: 'רחוב הראשי 123, תל אביב' },
];

const workingHours = [
  { day: 'ראשון - חמישי', hours: '09:00 - 14:45' },
  { day: 'שני + רביעי (ערב)', hours: '21:00 - 23:00' },
  { day: 'שישי - שבת', hours: 'סגור' },
];

const quickLinks = [
  { label: 'בית', href: '/' },
  { label: 'קביעת תור', href: '/book' },
  { label: 'אודות', href: '/#about' },
  { label: 'גלריה', href: '/#gallery' },
];

export function ModernFooter() {
  return (
    <footer id="contact" className="bg-brand-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">שירה סטייל</h3>
            <p className="text-white/70 leading-relaxed mb-6">
              מומחית להתאמה ועיצוב פאות. שירות אישי ומקצועי שמביא את היופי הטבעי שלך לידי ביטוי.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-pink-500/30 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-pink-500/30 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              ניווט מהיר
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-white/70 hover:text-pink-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">יצירת קשר</h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i}>
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="flex items-center gap-3 text-white/70 hover:text-pink-300 transition-colors"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.value}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-white/70">
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.value}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Working Hours */}
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              שעות פעילות
            </h4>
            <ul className="space-y-3">
              {workingHours.map((item, i) => (
                <li key={i} className="flex justify-between text-white/70">
                  <span>{item.day}</span>
                  <span className={cn(
                    item.hours === 'סגור' && 'text-pink-300'
                  )}>{item.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} שירה סטייל. כל הזכויות שמורות.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link to="/privacy" className="hover:text-white transition-colors">
              מדיניות פרטיות
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              תנאי שימוש
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
