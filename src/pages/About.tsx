import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { SectionTitle } from '@/components/ui/section-title';
import { GlassCard } from '@/components/ui/GlassCard';
import { getAboutContent, getPosts } from '@/lib/api';
import type { AboutContent, Post } from '@/types';
import { CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function About() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAboutContent(), getPosts()])
      .then(([aboutData, postsData]) => {
        setAbout(aboutData);
        setPosts(postsData.filter(p => p.isPublished));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-2 border-brand-700 border-t-transparent rounded-full" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* About Section */}
          <SectionTitle title={about?.title || 'אודותיי'} />
          
          <GlassCard className="p-8 mb-12">
            <p className="text-lg text-brand-800 leading-relaxed mb-8">
              {about?.description}
            </p>
            
            {about?.highlights && about.highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {about.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl"
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-brand-800 font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Publications Section */}
          {posts.length > 0 && (
            <>
              <SectionTitle 
                title="עדכונים ופרסומים" 
                subtitle="חדשות ועדכונים מהסלון"
              />
              
              <div className="space-y-6">
                {posts.map((post) => (
                  <GlassCard key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-6 w-6 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-brand-800 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-pink-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(post.date), 'd בMMMM yyyy', { locale: he })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
