import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ImageCollage } from '@/components/ui/ImageCollage';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { ArrowLeft } from 'lucide-react';

interface ModernHeroProps {
  title: string;
  subtitle: string;
  heroImages?: string[];
  showCTA?: boolean;
  children?: ReactNode;
}

export function ModernHero({ 
  title, 
  subtitle, 
  heroImages = [],
  showCTA = true,
  children 
}: ModernHeroProps) {
  const defaultImages = [
    '/src/assets/hero/hero-1.jpg',
    '/src/assets/hero/hero-2.jpg',
    '/src/assets/hero/hero-3.jpg',
  ];
  
  const images = heroImages.length > 0 ? heroImages : defaultImages;

  const scrollToGallery = () => {
    const gallery = document.getElementById('gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero" />
      
      {/* Decorative shapes */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content - Right side (RTL) */}
          <div className="text-right order-2 lg:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in leading-tight">
              {title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl animate-slide-up leading-relaxed">
              {subtitle}
            </p>
            
            {showCTA && (
              <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <Link to="/book">
                  <PrimaryButton size="lg" glow className="bg-white text-brand-800 hover:bg-white/90">
                    לקביעת תור
                    <ArrowLeft className="h-5 w-5" />
                  </PrimaryButton>
                </Link>
                <SecondaryButton size="lg" onClick={scrollToGallery} className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  לגלריה
                </SecondaryButton>
              </div>
            )}
            
            {children}
          </div>
          
          {/* Image Collage - Left side (RTL) */}
          <div className="order-1 lg:order-2">
            <ImageCollage images={images} />
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-100 to-transparent" />
    </section>
  );
}
