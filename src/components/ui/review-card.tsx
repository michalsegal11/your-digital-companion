import { Star, Quote } from 'lucide-react';

interface ReviewCardProps {
  name: string;
  rating: number;
  text: string;
  date: string;
}

export function ReviewCard({ name, rating, text, date }: ReviewCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-glow transition-all">
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-gold fill-gold' : 'text-muted'}`}
          />
        ))}
      </div>
      
      <div className="relative">
        <Quote className="absolute -top-2 -right-2 h-8 w-8 text-primary/10" />
        <p className="text-foreground leading-relaxed mb-4 relative z-10">
          {text}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="font-medium text-foreground">{name}</span>
        <span className="text-sm text-muted-foreground">{date}</span>
      </div>
    </div>
  );
}
