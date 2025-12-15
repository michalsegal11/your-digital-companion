import { useEffect, useCallback } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LightboxModalProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function LightboxModal({ 
  images, 
  currentIndex, 
  onClose, 
  onNavigate 
}: LightboxModalProps) {
  const isOpen = currentIndex !== null;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handleNext(); // RTL - left arrow goes next
          break;
        case 'ArrowRight':
          handlePrev(); // RTL - right arrow goes prev
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-900/95 backdrop-blur-xl animate-fade-in" />
      
      {/* Content */}
      <div 
        className="relative z-10 w-full max-w-5xl mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 left-0 text-white/80 hover:text-white transition-colors p-2"
          aria-label="סגירה"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-elevated">
          <img 
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="w-full max-h-[80vh] object-contain bg-brand-800"
          />
        </div>

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className={cn(
            'absolute top-1/2 right-4 -translate-y-1/2',
            'w-12 h-12 rounded-full',
            'bg-white/10 backdrop-blur-sm border border-white/20',
            'text-white hover:bg-white/20 transition-all',
            'flex items-center justify-center'
          )}
          aria-label="הקודם"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className={cn(
            'absolute top-1/2 left-4 -translate-y-1/2',
            'w-12 h-12 rounded-full',
            'bg-white/10 backdrop-blur-sm border border-white/20',
            'text-white hover:bg-white/20 transition-all',
            'flex items-center justify-center'
          )}
          aria-label="הבא"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Counter */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
