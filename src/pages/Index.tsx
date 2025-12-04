import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Home, Search, Bell, User, BrainCircuit, Megaphone, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment, DEFAULT_USER, CATEGORIES, formatTimeAgo } from '@/lib/data';
import { Toast } from '@/components/Toast';
import { NavIcon } from '@/components/NavIcon';
import { Header } from '@/components/Header';
import { PostComposer } from '@/components/PostComposer';
import { PostCard } from '@/components/PostCard';
import { ProfileView } from '@/components/ProfileView';
import { Sidebar } from '@/components/Sidebar';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';
import { CreateMatchModal } from '@/components/modals/CreateMatchModal';
import { RatingModal } from '@/components/modals/RatingModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { toast } from 'sonner';

export default function Index() {
  const { user, profile, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeNav, setActiveNav] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostText, setNewPostText] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      const postsWithDetails = await Promise.all(
        data.map(async (post) => {
          const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', post.user_id).maybeSingle();
          const { data: likesData } = await supabase.from('post_likes').select('user_id').eq('post_id', post.id);
          const { data: savedData } = await supabase.from('saved_posts').select('id').eq('post_id', post.id).eq('user_id', user!.id).maybeSingle();
          const { data: commentsData } = await supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
          
          const commentsWithProfiles = await Promise.all(
            (commentsData || []).map(async (c) => {
              const { data: cProfile } = await supabase.from('profiles').select('*').eq('user_id', c.user_id).maybeSingle();
              return {
                id: c.id,
                user: cProfile?.full_name || 'Anonim',
                userId: c.user_id,
                avatar: cProfile?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
                text: c.content,
                time: formatTimeAgo(new Date(c.created_at)),
              };
            })
          );

          return {
            id: post.id,
            type: post.type as any,
            category: post.category || 'all',
            user: profileData?.full_name || 'Anonim',
            userId: post.user_id,
            avatar: profileData?.avatar_url || 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
            title: post.title,
            description: post.description,
            thumbnail: post.thumbnail,
            formation: post.formation,
            views: post.views,
            likes: post.likes_count || 0,
            isLiked: likesData?.some(l => l.user_id === user!.id) || false,
            isSaved: !!savedData,
            time: formatTimeAgo(new Date(post.created_at)),
            tags: post.tags,
            qorsScore: profileData?.qors_score || 5.0,
            badge: post.badge,
            comments: commentsWithProfiles,
            subType: post.sub_type,
            location: post.location,
            timeSpec: post.time_spec,
            price: post.price,
            urgency: post.urgency,
          };
        })
      );
      setPosts(postsWithDetails);
    }
  };

  const currentUserData = {
    ...DEFAULT_USER,
    id: user?.id || DEFAULT_USER.id,
    name: profile?.full_name || DEFAULT_USER.name,
    handle: profile?.username ? `@${profile.username}` : DEFAULT_USER.handle,
    avatar: profile?.avatar_url || DEFAULT_USER.avatar,
    cover: profile?.cover_url || DEFAULT_USER.cover,
    bio: profile?.bio || DEFAULT_USER.bio,
    role: profile?.role || DEFAULT_USER.role,
    qorsScore: profile?.qors_score || DEFAULT_USER.qorsScore,
    matchesPlayed: profile?.matches_played || DEFAULT_USER.matchesPlayed,
    reliability: profile?.reliability || DEFAULT_USER.reliability,
    stats: { mvp: profile?.mvp_count || 0, goals: profile?.goals || 0, assists: profile?.assists || 0 },
    fairPlayBadge: profile?.fair_play_badge || DEFAULT_USER.fairPlayBadge,
  };

  const filteredPosts = posts.filter((p) => {
    const categoryMatch = activeCategory === 'all' ? true : activeCategory === 'lmg' ? p.category === 'lmg' || p.urgency === 'Acil' : p.category === activeCategory;
    const searchMatch = searchTerm === '' ? true : p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post || !user) return;
    
    if (post.isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    }
    fetchPosts();
  };

  const handleSave = async (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post || !user) return;
    
    if (post.isSaved) {
      await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
      toast.success('Kaydedilenlerden çıkarıldı');
    } else {
      await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
      toast.success('Kaydedildi!');
    }
    fetchPosts();
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğine emin misin?')) return;
    await supabase.from('posts').delete().eq('id', postId);
    toast.success('Gönderi silindi');
    fetchPosts();
  };

  const handleSharePost = async (imageUrl?: string) => {
    if (!newPostText.trim() || !user) return;
    await supabase.from('posts').insert({
      user_id: user.id,
      type: 'status',
      title: newPostText,
      thumbnail: imageUrl,
    });
    setNewPostText('');
    toast.success('Paylaşıldı!');
    fetchPosts();
  };

  const handleAddComment = async (postId: string, text: string) => {
    if (!user) return;
    await supabase.from('comments').insert({ post_id: postId, user_id: user.id, content: text });
    fetchPosts();
  };

  const handleCreateMatch = async (data: any) => {
    if (!user) return;
    await supabase.from('posts').insert({
      user_id: user.id,
      type: 'transfer',
      category: 'lmg',
      title: data.title,
      description: data.description,
      location: data.location,
      time_spec: `${data.date} ${data.time}`,
      price: data.price,
      urgency: data.urgency,
      sub_type: 'oyuncu',
    });
    toast.success('Maç oluşturuldu!');
    fetchPosts();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const savedPostsData = posts.filter(p => p.isSaved);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex overflow-hidden relative">
      {isCreateModalOpen && <CreateMatchModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateMatch} />}
      {isRatingModalOpen && <RatingModal onClose={() => setIsRatingModalOpen(false)} onSubmit={() => toast.success('Değerlendirme gönderildi!')} />}
      {isEditProfileOpen && <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} onSuccess={() => toast.success('Profil güncellendi!')} />}

      {/* Left Sidebar */}
      <aside className="w-20 bg-surface flex flex-col items-center py-6 border-r border-border z-20 shrink-0">
        <div className="mb-8 cursor-pointer" onClick={() => { setActiveNav('home'); setActiveCategory('all'); }}>
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse-glow">
            <Trophy className="text-primary-foreground w-7 h-7" strokeWidth={3} />
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-6 w-full">
          <NavIcon icon={Home} label="Anasayfa" id="home" activeNav={activeNav} onClick={setActiveNav} />
          <NavIcon icon={Search} label="Keşfet" id="search" activeNav={activeNav} onClick={() => { setActiveNav('home'); setTimeout(() => document.getElementById('search-input')?.focus(), 100); }} />
          <NavIcon icon={BrainCircuit} label="Qors Akademi" id="academy" activeNav={activeNav} onClick={() => { setActiveNav('home'); setActiveCategory('defense'); }} />
          <NavIcon icon={Megaphone} label="LMG (Acil)" id="lmg" activeNav={activeNav} onClick={() => { setActiveNav('home'); setActiveCategory('lmg'); }} />
          <div className="relative w-full flex justify-center" onClick={(e) => e.stopPropagation()}>
            <NavIcon icon={Bell} label="Bildirimler" id="notifications" activeNav={activeNav} onClick={() => setShowNotifications(!showNotifications)} badge={3} />
            {showNotifications && <NotificationsDropdown onOpenRating={() => setIsRatingModalOpen(true)} onOpenMatchStar={() => {}} />}
          </div>
          <NavIcon icon={User} label="Profilim" id="profile" activeNav={activeNav} onClick={setActiveNav} />
          {isAdmin && <NavIcon icon={Shield} label="Admin" id="admin" activeNav={activeNav} onClick={() => navigate('/admin')} />}
        </nav>

        <div className="mt-auto space-y-4">
          <button onClick={handleSignOut} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-all" title="Çıkış Yap">
            <LogOut className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden ring-2 ring-muted cursor-pointer hover:ring-primary transition-all" onClick={() => setActiveNav('profile')}>
            <img src={currentUserData.avatar} alt="Profil" className="w-full h-full object-cover" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {activeNav === 'home' && (
          <>
            <Header activeCategory={activeCategory} setActiveCategory={setActiveCategory} onOpenModal={() => setIsCreateModalOpen(true)} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <PostComposer newPostText={newPostText} setNewPostText={setNewPostText} onSharePost={handleSharePost} userAvatar={currentUserData.avatar} />
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPosts.length === 0 && (
                  <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-bold">Henüz gönderi yok</p>
                    <p className="text-sm mt-2">İlk gönderiyi sen paylaş!</p>
                  </div>
                )}
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserData.id}
                    onLike={() => handleLike(post.id)}
                    onSave={() => handleSave(post.id)}
                    onDelete={() => handleDeletePost(post.id)}
                    onApply={post.type === 'transfer' ? () => toast.success('Başvurunuz iletildi!') : undefined}
                    onAddComment={(text) => handleAddComment(post.id, text)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeNav === 'profile' && (
          <ProfileView user={currentUserData} posts={savedPostsData} onBack={() => setActiveNav('home')} onReset={() => {}} onEditProfile={() => setIsEditProfileOpen(true)} />
        )}
      </main>

      <Sidebar />
    </div>
  );
}
