import { cn } from '@/lib/utils';
import type { TimeSlot } from '@/types';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading?: boolean;
}

export function TimeSlotGrid({ slots, selectedTime, onSelect, loading }: TimeSlotGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        אין זמנים פנויים בתאריך זה
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.time}
          onClick={() => slot.available && onSelect(slot.time)}
          disabled={!slot.available}
          className={cn(
            'h-12 rounded-lg text-sm font-medium transition-all',
            slot.available
              ? selectedTime === slot.time
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-card border border-border hover:border-primary hover:text-primary'
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
          )}
        >
          {slot.time}
        </button>
      ))}
    </div>
  );
}
