import { cn } from '@/lib/utils';
import { generateTimeSlots, getHebrewDateLabel, type TimeSlot as SchedulingTimeSlot } from '@/lib/scheduling';
import { SlotGridSkeleton } from './Skeleton';
import { Sun, Moon } from 'lucide-react';

interface TimeSlotGridProps {
  slots: SchedulingTimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  loading?: boolean;
  className?: string;
}

export function ModernTimeSlotGrid({ 
  slots, 
  selectedTime, 
  onSelect, 
  loading = false,
  className 
}: TimeSlotGridProps) {
  if (loading) {
    return <SlotGridSkeleton />;
  }

  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>אין זמנים פנויים ביום זה</p>
      </div>
    );
  }

  // Separate morning and evening slots
  const morningSlots = slots.filter(s => s.shift === 'morning');
  const eveningSlots = slots.filter(s => s.shift === 'evening');

  const SlotSection = ({ 
    title, 
    icon: Icon, 
    sectionSlots 
  }: { 
    title: string; 
    icon: typeof Sun; 
    sectionSlots: SchedulingTimeSlot[];
  }) => {
    if (sectionSlots.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" />
          {title}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {sectionSlots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => slot.available && onSelect(slot.time)}
              disabled={!slot.available}
              className={cn(
                'h-11 rounded-xl text-sm font-medium transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                slot.available
                  ? selectedTime === slot.time
                    ? 'gradient-brand text-white shadow-glow'
                    : 'bg-white border border-neutral-200 text-brand-800 hover:border-brand-600 hover:bg-pink-100/50'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed line-through'
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      <SlotSection title="בוקר / צהריים" icon={Sun} sectionSlots={morningSlots} />
      <SlotSection title="ערב" icon={Moon} sectionSlots={eveningSlots} />
    </div>
  );
}

// Re-export for backwards compatibility
export { ModernTimeSlotGrid as TimeSlotGrid };
