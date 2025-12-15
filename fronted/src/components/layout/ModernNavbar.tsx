import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'בית' },
  { href: '/#about', label: 'אודות' },
  { href: '/#services', label: 'שירותים' },
  { href: '/#gallery', label: 'גלריה' },
  { href: '/#contact', label: 'צור קשר' },
];

export function ModernNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNavClick = (href: string) => {
    if (href.startsWith('/#')) {
      const elementId = href.replace('/#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'glass-strong py-3 shadow-soft' 
          : 'bg-transparent py-5'
      )}
    >
      <nav className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/src/assets/logo.png" 
            alt="שירה סטייל" 
            className="h-10 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className={cn(
            'text-xl font-bold transition-colors',
            isScrolled ? 'text-brand-800' : 'text-white'
          )}>
            שירה סטייל
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className={cn(
                'text-sm font-medium transition-all duration-300 relative',
                'after:absolute after:bottom-0 after:right-0 after:w-0 after:h-0.5',
                'after:bg-pink-500 after:transition-all after:duration-300',
                'hover:after:w-full',
                isScrolled 
                  ? 'text-brand-800 hover:text-brand-700' 
                  : 'text-white/90 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link to="/book">
            <PrimaryButton size="sm" glow>
              קביעת תור
            </PrimaryButton>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={cn(
            'md:hidden p-2 rounded-xl transition-colors',
            isScrolled ? 'text-brand-800' : 'text-white'
          )}
          aria-label="תפריט"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={cn(
          'md:hidden absolute top-full left-0 right-0 glass-strong shadow-elevated',
          'transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-brand-800 font-medium py-2 border-b border-neutral-200 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/book" className="mt-2">
            <PrimaryButton className="w-full">
              קביעת תור
            </PrimaryButton>
          </Link>
        </div>
      </div>
    </header>
  );
}
