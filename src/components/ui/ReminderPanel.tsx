import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { GlassCard } from './GlassCard';
import { Bell, MessageSquare, Mail } from 'lucide-react';

interface ReminderPanelProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  channels: {
    sms: boolean;
    email: boolean;
  };
  onChannelChange: (channel: 'sms' | 'email', value: boolean) => void;
  className?: string;
}

export function ReminderPanel({
  enabled,
  onEnabledChange,
  channels,
  onChannelChange,
  className
}: ReminderPanelProps) {
  return (
    <GlassCard className={cn('p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
            <Bell className="h-5 w-5 text-brand-700" />
          </div>
          <div>
            <Label className="text-base font-medium text-brand-800">
              האם לשלוח תזכורת ללקוחה?
            </Label>
            <p className="text-sm text-muted-foreground">
              תזכורת תישלח יום לפני התור
            </p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          className="data-[state=checked]:bg-brand-700"
        />
      </div>

      {enabled && (
        <div className="space-y-4 pt-4 border-t border-neutral-200 animate-slide-up">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            אמצעי שליחה:
          </p>
          
          <div className="flex flex-wrap gap-4">
            <label className={cn(
              'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all',
              channels.sms 
                ? 'bg-pink-100 border-2 border-pink-300' 
                : 'bg-white border-2 border-neutral-200 hover:border-neutral-300'
            )}>
              <Checkbox
                checked={channels.sms}
                onCheckedChange={(checked) => onChannelChange('sms', !!checked)}
                className="border-neutral-300 data-[state=checked]:bg-brand-700 data-[state=checked]:border-brand-700"
              />
              <MessageSquare className="h-5 w-5 text-brand-700" />
              <span className="font-medium text-brand-800">SMS</span>
            </label>

            <label className={cn(
              'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all',
              channels.email 
                ? 'bg-pink-100 border-2 border-pink-300' 
                : 'bg-white border-2 border-neutral-200 hover:border-neutral-300'
            )}>
              <Checkbox
                checked={channels.email}
                onCheckedChange={(checked) => onChannelChange('email', !!checked)}
                className="border-neutral-300 data-[state=checked]:bg-brand-700 data-[state=checked]:border-brand-700"
              />
              <Mail className="h-5 w-5 text-brand-700" />
              <span className="font-medium text-brand-800">אימייל</span>
            </label>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
