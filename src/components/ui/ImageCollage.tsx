import { cn } from '@/lib/utils';

interface ImageCollageProps {
  images: string[];
  className?: string;
}

export function ImageCollage({ images, className }: ImageCollageProps) {
  // Ensure we have at least 3 images
  const displayImages = [
    images[0] || '/placeholder.svg',
    images[1] || '/placeholder.svg',
    images[2] || '/placeholder.svg',
  ];

  return (
    <div className={cn('relative w-full max-w-lg mx-auto', className)}>
      {/* Main large image */}
      <div className="relative z-10 rounded-3xl overflow-hidden shadow-elevated animate-float">
        <img 
          src={displayImages[0]} 
          alt="Hero 1"
          className="w-full h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/20 to-transparent" />
      </div>
      
      {/* Second image - positioned behind and to the right */}
      <div 
        className="absolute -left-8 top-12 z-0 rounded-2xl overflow-hidden shadow-soft w-40 h-52"
        style={{ animationDelay: '0.5s' }}
      >
        <img 
          src={displayImages[1]} 
          alt="Hero 2"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-pink-300/20" />
      </div>
      
      {/* Third image - positioned behind and to the left */}
      <div 
        className="absolute -right-6 bottom-8 z-0 rounded-2xl overflow-hidden shadow-soft w-36 h-48"
        style={{ animationDelay: '1s' }}
      >
        <img 
          src={displayImages[2]} 
          alt="Hero 3"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-700/10" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-pink-300/30 blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-brand-600/20 blur-2xl" />
    </div>
  );
}
