import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  children?: ReactNode;
  showBookButton?: boolean;
}

export function Hero({ title, subtitle, backgroundImage, children, showBookButton = true }: HeroProps) {
  return (
    <section 
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage 
          ? `linear-gradient(to bottom, hsl(350 30% 20% / 0.7), hsl(350 30% 30% / 0.5)), url(${backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {!backgroundImage && (
        <div className="absolute inset-0 gradient-primary opacity-90" />
      )}
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 animate-slide-up">
            {subtitle}
          </p>
        )}
        
        {children}
        
        {showBookButton && (
          <Button 
            asChild 
            size="lg" 
            className="mt-8 bg-background text-primary hover:bg-background/90 gap-2 text-lg px-8 py-6 shadow-glow animate-slide-up"
          >
            <Link to="/book">
              לקביעת תור עכשיו
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
