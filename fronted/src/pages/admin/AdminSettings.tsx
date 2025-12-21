import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  getWorkingHours, 
  updateWorkingHours, 
  getServices, 
  updateService,
  getSystemSettings,
  updateSystemSettings,
  getAboutContent,
  updateAboutContent,
  getPosts,
  savePost,
  deletePost
} from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import type { WorkingHours, Service, SystemSettings, AboutContent, Post } from '@/types';
import { Clock, Settings, FileText, Newspaper, Plus, Trash2, Save, Moon, Sun } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('hours');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Working hours
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  
  // Services
  const [services, setServices] = useState<Service[]>([]);
  
  // System settings
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  
  // Content
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);

  useEffect(() => {
    Promise.all([
      getWorkingHours(),
      getServices(),
      getSystemSettings(),
      getAboutContent(),
      getPosts(),
    ])
      .then(([hours, servicesData, settingsData, aboutData, postsData]) => {
        setWorkingHours(hours);
        setServices(servicesData);
        setSettings(settingsData);
        setAbout(aboutData);
        setPosts(postsData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveHours = async () => {
    setSaving(true);
    try {
      await updateWorkingHours(workingHours);
      toast({ title: 'שעות הפעילות נשמרו' });
    } catch {
      toast({ title: 'שגיאה בשמירה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveServices = async () => {
    setSaving(true);
    try {
      for (const service of services) {
        await updateService(service);
      }
      toast({ title: 'השירותים נשמרו' });
    } catch {
      toast({ title: 'שגיאה בשמירה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSystemSettings(settings);
      toast({ title: 'ההגדרות נשמרו' });
    } catch {
      toast({ title: 'שגיאה בשמירה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAbout = async () => {
    if (!about) return;
    setSaving(true);
    try {
      await updateAboutContent(about);
      toast({ title: 'תוכן האודות נשמר' });
    } catch {
      toast({ title: 'שגיאה בשמירה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePost = async () => {
    if (!editingPost?.title || !editingPost?.content) return;
    setSaving(true);
    try {
      const saved = await savePost({
        ...editingPost,
        date: editingPost.date || new Date().toISOString().split('T')[0],
        isPublished: editingPost.isPublished ?? true,
      } as Omit<Post, 'id'> & { id?: string });
      
      if (editingPost.id) {
        setPosts(prev => prev.map(p => p.id === saved.id ? saved : p));
      } else {
        setPosts(prev => [saved, ...prev]);
      }
      setEditingPost(null);
      toast({ title: 'הפרסום נשמר' });
    } catch {
      toast({ title: 'שגיאה בשמירה', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast({ title: 'הפרסום נמחק' });
    } catch {
      toast({ title: 'שגיאה במחיקה', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-2 border-brand-700 border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-brand-800">הגדרות מערכת</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-neutral-100">
            <TabsTrigger value="hours" className="gap-2">
              <Clock className="h-4 w-4" />
              שעות פעילות
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Settings className="h-4 w-4" />
              שירותים
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Settings className="h-4 w-4" />
              מערכת
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              תוכן
            </TabsTrigger>
            <TabsTrigger value="posts" className="gap-2">
              <Newspaper className="h-4 w-4" />
              פרסומים
            </TabsTrigger>
          </TabsList>

          {/* Working Hours Tab */}
          <TabsContent value="hours" className="space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">שעות פעילות</h2>
              <div className="space-y-4">
                {workingHours.map((day, index) => (
                  <div key={day.dayOfWeek} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                    <div className="w-24 font-medium">{day.dayName}</div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={day.isWorkingDay}
                        onCheckedChange={(checked) => {
                          const updated = [...workingHours];
                          updated[index].isWorkingDay = checked;
                          setWorkingHours(updated);
                        }}
                      />
                      <Label className="text-sm">יום עבודה</Label>
                    </div>

                    {day.isWorkingDay && (
                      <>
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-amber-500" />
                          <Input
                            type="time"
                            value={day.morningShift.start}
                            onChange={(e) => {
                              const updated = [...workingHours];
                              updated[index].morningShift.start = e.target.value;
                              setWorkingHours(updated);
                            }}
                            className="w-28"
                          />
                          <span>-</span>
                          <Input
                            type="time"
                            value={day.morningShift.end}
                            onChange={(e) => {
                              const updated = [...workingHours];
                              updated[index].morningShift.end = e.target.value;
                              setWorkingHours(updated);
                            }}
                            className="w-28"
                          />
                        </div>

                        {(day.dayOfWeek === 1 || day.dayOfWeek === 3) && (
                          <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-indigo-500" />
                            <Switch
                              checked={day.eveningShift?.enabled ?? false}
                              onCheckedChange={(checked) => {
                                const updated = [...workingHours];
                                if (!updated[index].eveningShift) {
                                  updated[index].eveningShift = { start: '21:00', end: '23:00', enabled: checked };
                                } else {
                                  updated[index].eveningShift!.enabled = checked;
                                }
                                setWorkingHours(updated);
                              }}
                            />
                            <Label className="text-sm">משמרת ערב</Label>
                            {day.eveningShift?.enabled && (
                              <>
                                <Input
                                  type="time"
                                  value={day.eveningShift?.start || '21:00'}
                                  onChange={(e) => {
                                    const updated = [...workingHours];
                                    updated[index].eveningShift!.start = e.target.value;
                                    setWorkingHours(updated);
                                  }}
                                  className="w-28"
                                />
                                <span>-</span>
                                <Input
                                  type="time"
                                  value={day.eveningShift?.end || '23:00'}
                                  onChange={(e) => {
                                    const updated = [...workingHours];
                                    updated[index].eveningShift!.end = e.target.value;
                                    setWorkingHours(updated);
                                  }}
                                  className="w-28"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveHours} disabled={saving} className="mt-4 bg-brand-700 hover:bg-brand-800">
                <Save className="h-4 w-4 ml-2" />
                שמירה
              </Button>
            </GlassCard>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">ניהול שירותים</h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl">
                    <Input
                      value={service.name}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[index].name = e.target.value;
                        setServices(updated);
                      }}
                      className="w-40"
                      placeholder="שם השירות"
                    />
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">משך (דקות):</Label>
                      <Input
                        type="number"
                        value={service.duration}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].duration = parseInt(e.target.value) || 15;
                          setServices(updated);
                        }}
                        className="w-20"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">מחיר (₪):</Label>
                      <Input
                        type="number"
                        value={service.price}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].price = parseInt(e.target.value) || 0;
                          setServices(updated);
                        }}
                        className="w-24"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={(checked) => {
                          const updated = [...services];
                          updated[index].isActive = checked;
                          setServices(updated);
                        }}
                      />
                      <Label className="text-sm">פעיל</Label>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveServices} disabled={saving} className="mt-4 bg-brand-700 hover:bg-brand-800">
                <Save className="h-4 w-4 ml-2" />
                שמירה
              </Button>
            </GlassCard>
          </TabsContent>

          {/* System Settings Tab */}
          <TabsContent value="system" className="space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">הגדרות מערכת</h2>
              {settings && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="w-48">זמן ביטול מינימלי (שעות):</Label>
                    <Input
                      type="number"
                      value={settings.cancellationDeadlineHours}
                      onChange={(e) => setSettings({
                        ...settings,
                        cancellationDeadlineHours: parseInt(e.target.value) || 24
                      })}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-48">שליחת תזכורת (ימים לפני):</Label>
                    <Input
                      type="number"
                      value={settings.reminderDaysBefore}
                      onChange={(e) => setSettings({
                        ...settings,
                        reminderDaysBefore: parseInt(e.target.value) || 1
                      })}
                      className="w-24"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-48">אזור זמן:</Label>
                    <Input
                      value={settings.timezone}
                      onChange={(e) => setSettings({
                        ...settings,
                        timezone: e.target.value
                      })}
                      className="w-48"
                      disabled
                    />
                  </div>
                </div>
              )}
              <Button onClick={handleSaveSettings} disabled={saving} className="mt-4 bg-brand-700 hover:bg-brand-800">
                <Save className="h-4 w-4 ml-2" />
                שמירה
              </Button>
            </GlassCard>
          </TabsContent>

          {/* About Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold mb-4">עריכת דף אודות</h2>
              {about && (
                <div className="space-y-4">
                  <div>
                    <Label>כותרת</Label>
                    <Input
                      value={about.title}
                      onChange={(e) => setAbout({ ...about, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>תיאור</Label>
                    <textarea
                      value={about.description}
                      onChange={(e) => setAbout({ ...about, description: e.target.value })}
                      className="w-full h-32 p-3 border rounded-xl resize-none"
                    />
                  </div>
                  <div>
                    <Label>נקודות מרכזיות (שורה לכל נקודה)</Label>
                    <textarea
                      value={about.highlights.join('\n')}
                      onChange={(e) => setAbout({ 
                        ...about, 
                        highlights: e.target.value.split('\n').filter(h => h.trim()) 
                      })}
                      className="w-full h-32 p-3 border rounded-xl resize-none"
                    />
                  </div>
                </div>
              )}
              <Button onClick={handleSaveAbout} disabled={saving} className="mt-4 bg-brand-700 hover:bg-brand-800">
                <Save className="h-4 w-4 ml-2" />
                שמירה
              </Button>
            </GlassCard>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts" className="space-y-4">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">פרסומים ועדכונים</h2>
                <Button 
                  onClick={() => setEditingPost({ title: '', content: '', isPublished: true })}
                  className="bg-brand-700 hover:bg-brand-800"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  פרסום חדש
                </Button>
              </div>

              {editingPost && (
                <div className="mb-6 p-4 bg-pink-50 rounded-xl space-y-4">
                  <Input
                    placeholder="כותרת"
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  />
                  <textarea
                    placeholder="תוכן"
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full h-24 p-3 border rounded-xl resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingPost.isPublished ?? true}
                      onCheckedChange={(checked) => setEditingPost({ ...editingPost, isPublished: checked })}
                    />
                    <Label>פרסום פעיל</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSavePost} disabled={saving} className="bg-brand-700 hover:bg-brand-800">
                      שמירה
                    </Button>
                    <Button variant="outline" onClick={() => setEditingPost(null)}>
                      ביטול
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {posts.map(post => (
                  <div key={post.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <h4 className="font-medium">{post.title}</h4>
                      <p className="text-sm text-muted-foreground">{post.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingPost(post)}
                      >
                        עריכה
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
