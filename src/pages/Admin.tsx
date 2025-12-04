import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Users, 
  FileText, 
  Trash2, 
  ArrowLeft, 
  Search,
  Crown,
  UserX,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  qors_score: number;
  role: string | null;
  created_at: string;
  userRole: string;
}

interface PostWithUser {
  id: string;
  title: string;
  type: string;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    username: string | null;
  } | null;
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && !isAdmin) {
      navigate('/');
      toast.error('Bu sayfaya erişim yetkiniz yok');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchPosts();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && profiles) {
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.user_id)
            .maybeSingle();
          
          return {
            ...profile,
            userRole: roleData?.role || 'user'
          };
        })
      );
      setUsers(usersWithRoles as UserWithRole[]);
    }
    setLoadingData(false);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      const postsWithUsers = await Promise.all(
        data.map(async (post) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('user_id', post.user_id)
            .maybeSingle();
          
          return {
            ...post,
            profiles: profileData
          };
        })
      );
      setPosts(postsWithUsers as PostWithUser[]);
    }
  };

  const handleMakeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', userId);

    if (error) {
      toast.error('Rol güncellenemedi');
    } else {
      toast.success('Kullanıcı admin yapıldı');
      fetchUsers();
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: 'user' })
      .eq('user_id', userId);

    if (error) {
      toast.error('Rol güncellenemedi');
    } else {
      toast.success('Admin yetkisi kaldırıldı');
      fetchUsers();
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bu gönderiyi silmek istediğinize emin misiniz?')) return;

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast.error('Gönderi silinemedi');
    } else {
      toast.success('Gönderi silindi');
      fetchPosts();
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Kullanıcılar ({users.length})
          </Button>
          <Button
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('posts')}
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Gönderiler ({posts.length})
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-3">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Users className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{u.full_name || 'İsimsiz'}</span>
                      {u.userRole === 'admin' && (
                        <Crown className="w-4 h-4 text-warning" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">@{u.username || 'kullanici'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-4">
                    QORS: {u.qors_score}
                  </span>
                  {u.userRole === 'admin' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAdmin(u.user_id)}
                      className="gap-1 text-destructive border-destructive hover:bg-destructive/10"
                      disabled={u.user_id === user?.id}
                    >
                      <UserX className="w-4 h-4" />
                      Admin Kaldır
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMakeAdmin(u.user_id)}
                      className="gap-1"
                    >
                      <Crown className="w-4 h-4" />
                      Admin Yap
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-3">
            {filteredPosts.map((p) => (
              <div
                key={p.id}
                className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold line-clamp-1">{p.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{p.profiles?.full_name || p.profiles?.username || 'Anonim'}</span>
                    <span>•</span>
                    <span className="capitalize">{p.type}</span>
                    <span>•</span>
                    <span>{new Date(p.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePost(p.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                Gönderi bulunamadı
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
