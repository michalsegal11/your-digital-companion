import { useState } from 'react';
import { cn } from '@/lib/utils';
import { LightboxModal } from './LightboxModal';

interface GalleryGridProps {
  images: string[];
  className?: string;
}

export function GalleryGrid({ images, className }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
        className
      )}>
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'group relative overflow-hidden rounded-2xl',
              'aspect-square',
              'transition-all duration-300 ease-out',
              'hover:scale-[1.02] hover:shadow-elevated',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              // Masonry-like variation
              index % 5 === 0 && 'md:row-span-2 md:aspect-auto md:h-full',
              index % 7 === 0 && 'lg:col-span-2'
            )}
          >
            <img 
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white font-medium text-sm bg-brand-800/50 backdrop-blur-sm px-4 py-2 rounded-full">
                הגדלה
              </span>
            </div>
          </button>
        ))}
      </div>

      <LightboxModal
        images={images}
        currentIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onNavigate={setSelectedIndex}
      />
    </>
  );
}
