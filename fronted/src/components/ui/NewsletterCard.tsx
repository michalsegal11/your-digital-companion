import { useState } from 'react';
import { cn } from '@/lib/utils';
import { GlassCard } from './GlassCard';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PrimaryButton } from './PrimaryButton';
import { Mail, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { addSubscriber } from '@/lib/api';

interface NewsletterCardProps {
  className?: string;
}

export function NewsletterCard({ className }: NewsletterCardProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({ title: 'נא להזין כתובת אימייל', variant: 'destructive' });
      return;
    }
    
    if (!consent) {
      toast({ title: 'נא לאשר קבלת עדכונים', variant: 'destructive' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: 'כתובת אימייל לא תקינה', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      await addSubscriber(email);
      toast({ 
        title: 'נרשמת בהצלחה! 🎉', 
        description: 'תודה שהצטרפת לרשימת התפוצה שלנו' 
      });
      setEmail('');
      setConsent(false);
    } catch {
      toast({ title: 'שגיאה בהרשמה', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard variant="strong" className={cn('p-8 max-w-md mx-auto', className)}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl gradient-pink flex items-center justify-center mx-auto mb-4">
          <Mail className="h-7 w-7 text-brand-700" />
        </div>
        <h3 className="text-xl font-bold text-brand-800 mb-2">
          הצטרפי לרשימת התפוצה
        </h3>
        <p className="text-muted-foreground text-sm">
          קבלי עדכונים על מבצעים, טיפים וחדשות
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="email"
            placeholder="כתובת אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-center rounded-xl border-neutral-200 focus:border-brand-600 bg-white/50"
          />
        </div>

        <div className="flex items-center justify-center gap-2">
          <Checkbox 
            id="consent" 
            checked={consent} 
            onCheckedChange={(c) => setConsent(!!c)}
            className="border-neutral-300 data-[state=checked]:bg-brand-700 data-[state=checked]:border-brand-700"
          />
          <label 
            htmlFor="consent" 
            className="text-sm text-muted-foreground cursor-pointer"
          >
            אני מאשרת קבלת עדכונים במייל
          </label>
        </div>

        <PrimaryButton 
          type="submit" 
          loading={loading}
          className="w-full"
        >
          <Sparkles className="h-4 w-4" />
          הרשמה
        </PrimaryButton>
      </form>
    </GlassCard>
  );
}
