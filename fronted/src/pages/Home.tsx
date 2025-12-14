import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Hero } from '@/components/ui/hero';
import { SectionTitle } from '@/components/ui/section-title';
import { ReviewCard } from '@/components/ui/review-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { mockReviews } from '@/lib/mockData';
import { addSubscriber } from '@/lib/api';
import { Sparkles, Heart, Award } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) {
      toast({ title: 'נא למלא את כל השדות', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await addSubscriber(email);
      toast({ title: 'נרשמת בהצלחה!', description: 'תודה שהצטרפת לרשימת התפוצה שלנו' });
      setEmail('');
      setConsent(false);
    } catch {
      toast({ title: 'שגיאה בהרשמה', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Hero
        title="שירה סטייל"
        subtitle="מומחית להתאמה ועיצוב פאות. שירות אישי ומקצועי שמביא את היופי הטבעי שלך לידי ביטוי."
      />

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionTitle title="אודות" subtitle="מקצועיות, אמינות ושירות אישי" />
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Sparkles, title: 'מקצועיות', desc: 'ניסיון של שנים בהתאמה ועיצוב פאות' },
              { icon: Heart, title: 'יחס אישי', desc: 'כל לקוחה מקבלת את תשומת הלב המלאה' },
              { icon: Award, title: 'איכות', desc: 'חומרים ומוצרים באיכות הגבוהה ביותר' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-card border border-border shadow-soft">
                <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionTitle title="מה הלקוחות אומרות" subtitle="ביקורות מלקוחות מרוצות" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {mockReviews.map((review) => (
              <ReviewCard key={review.id} {...review} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <SectionTitle title="הצטרפי לרשימת התפוצה" subtitle="קבלי עדכונים על מבצעים וטיפים" />
          <form onSubmit={handleNewsletterSubmit} className="space-y-4 mt-8">
            <Input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center"
            />
            <div className="flex items-center justify-center gap-2">
              <Checkbox id="consent" checked={consent} onCheckedChange={(c) => setConsent(!!c)} />
              <label htmlFor="consent" className="text-sm text-muted-foreground">
                אני מאשרת קבלת עדכונים במייל
              </label>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'נרשמת...' : 'הרשמה'}
            </Button>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
