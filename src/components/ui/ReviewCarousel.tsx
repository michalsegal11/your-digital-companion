import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date?: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
  className?: string;
}

export function ReviewCarousel({ reviews, className }: ReviewCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // RTL: scrollLeft is negative
      setCanScrollRight(scrollLeft < 0);
      setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [reviews]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      // RTL: directions are reversed
      const delta = direction === 'left' ? -scrollAmount : scrollAmount;
      scrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Navigation buttons */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={cn(
          'absolute top-1/2 right-0 z-10 -translate-y-1/2 translate-x-1/2',
          'w-12 h-12 rounded-full glass-card',
          'flex items-center justify-center',
          'text-brand-800 hover:bg-pink-100 transition-all',
          'disabled:opacity-0 disabled:pointer-events-none',
          'shadow-soft'
        )}
        aria-label="הקודם"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={cn(
          'absolute top-1/2 left-0 z-10 -translate-y-1/2 -translate-x-1/2',
          'w-12 h-12 rounded-full glass-card',
          'flex items-center justify-center',
          'text-brand-800 hover:bg-pink-100 transition-all',
          'disabled:opacity-0 disabled:pointer-events-none',
          'shadow-soft'
        )}
        aria-label="הבא"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Reviews scroll container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 -mx-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review) => (
          <GlassCard
            key={review.id}
            hover
            className="flex-shrink-0 w-80 p-6 snap-start"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-4 w-4',
                    i < review.rating 
                      ? 'fill-gold text-gold' 
                      : 'fill-neutral-200 text-neutral-200'
                  )}
                />
              ))}
            </div>

            {/* Text */}
            <p className="text-brand-800 leading-relaxed mb-4 line-clamp-4">
              "{review.text}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
              <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-brand-800">{review.name}</p>
                {review.date && (
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
