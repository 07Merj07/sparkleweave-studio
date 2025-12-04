import { useRef, useState } from 'react';
import { ArrowLeft, Camera, Settings, Edit3, Trophy, Target, Medal, Shield, RotateCcw } from 'lucide-react';
import { User, Post } from '@/lib/data';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileViewProps {
  user: User;
  posts: Post[];
  onBack: () => void;
  onReset: () => void;
  onEditProfile: () => void;
}

export function ProfileView({ user, posts, onBack, onReset, onEditProfile }: ProfileViewProps) {
  const { uploadAvatar, uploadCover, profile } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const { error } = await uploadAvatar(file);
    setUploadingAvatar(false);

    if (error) {
      toast.error('Fotoğraf yüklenemedi');
    } else {
      toast.success('Profil fotoğrafı güncellendi!');
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const { error } = await uploadCover(file);
    setUploadingCover(false);

    if (error) {
      toast.error('Kapak fotoğrafı yüklenemedi');
    } else {
      toast.success('Kapak fotoğrafı güncellendi!');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="relative h-48 bg-gradient-to-br from-primary/30 to-info/30">
        <img
          src={user.cover}
          alt="Kapak"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadingCover}
          className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
        >
          {uploadingCover ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-5 h-5" />
          )}
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          className="hidden"
        />
      </div>

      {/* Avatar & Info */}
      <div className="px-8 -mt-16 relative z-10">
        <div className="flex items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-background bg-surface">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center"
            >
              {uploadingAvatar ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-8 h-8" />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            {user.fairPlayBadge && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-glow">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 pb-4">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.handle}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                QORS {user.qorsScore}
              </span>
              <span className="px-2 py-1 bg-surface text-muted-foreground rounded-full text-sm">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pb-4">
            <Button onClick={onEditProfile} variant="outline" className="gap-2">
              <Edit3 className="w-4 h-4" />
              Profili Düzenle
            </Button>
            <Button onClick={onReset} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-muted-foreground">{user.bio}</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-surface rounded-xl p-4 text-center">
            <Trophy className="w-6 h-6 text-warning mx-auto mb-2" />
            <span className="text-2xl font-bold">{user.stats.mvp}</span>
            <p className="text-xs text-muted-foreground">MVP</p>
          </div>
          <div className="bg-surface rounded-xl p-4 text-center">
            <Target className="w-6 h-6 text-destructive mx-auto mb-2" />
            <span className="text-2xl font-bold">{user.stats.goals}</span>
            <p className="text-xs text-muted-foreground">Gol</p>
          </div>
          <div className="bg-surface rounded-xl p-4 text-center">
            <Medal className="w-6 h-6 text-info mx-auto mb-2" />
            <span className="text-2xl font-bold">{user.stats.assists}</span>
            <p className="text-xs text-muted-foreground">Asist</p>
          </div>
          <div className="bg-surface rounded-xl p-4 text-center">
            <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
            <span className="text-2xl font-bold">{user.matchesPlayed}</span>
            <p className="text-xs text-muted-foreground">Maç</p>
          </div>
        </div>

        {/* Saved Posts */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Kaydedilenler ({posts.length})</h3>
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-surface rounded-xl">
              <p>Henüz kaydedilen gönderi yok</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-surface rounded-xl p-4 hover:bg-surface-hover transition-colors">
                  <h4 className="font-semibold line-clamp-2">{post.title}</h4>
                  <p className="text-sm text-muted-foreground mt-2">{post.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
