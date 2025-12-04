import { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Trash2, Play, MapPin, Clock, DollarSign, AlertCircle, Users } from 'lucide-react';
import { Post, formatViews, formatTimeAgo } from '@/lib/data';
import { CommentSection } from './CommentSection';

interface PostCardProps {
  post: Post;
  currentUserId: string;
  onLike: () => void;
  onSave: () => void;
  onDelete: () => void;
  onApply?: () => void;
  onAddComment: (text: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onLike,
  onSave,
  onDelete,
  onApply,
  onAddComment,
}: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isOwner = post.userId === currentUserId;

  const renderContent = () => {
    switch (post.type) {
      case 'video':
        return (
          <div className="relative group">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-glow">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
            </div>
            {post.views && (
              <span className="absolute bottom-3 right-3 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md text-xs font-medium">
                {formatViews(post.views)} görüntüleme
              </span>
            )}
            {post.badge && (
              <span className="absolute top-3 left-3 px-2 py-1 bg-primary text-primary-foreground rounded-md text-xs font-bold">
                {post.badge}
              </span>
            )}
          </div>
        );

      case 'transfer':
        return (
          <div className="space-y-3">
            {post.urgency === 'Acil' && (
              <div className="flex items-center gap-2 text-urgent">
                <AlertCircle className="w-5 h-5" />
                <span className="font-bold">ACİL OYUNCU ARANIYOR!</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {post.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{post.location}</span>
                </div>
              )}
              {post.timeSpec && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{post.timeSpec}</span>
                </div>
              )}
              {post.price && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{post.price}</span>
                </div>
              )}
              {post.subType && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="capitalize">{post.subType}</span>
                </div>
              )}
            </div>
            {onApply && (
              <button
                onClick={onApply}
                className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-glow"
              >
                Başvur
              </button>
            )}
          </div>
        );

      case 'lineup':
        return (
          <div className="bg-surface-hover rounded-xl p-4">
            <div className="text-center mb-2">
              <span className="text-2xl font-bold text-primary">{post.formation}</span>
              <p className="text-sm text-muted-foreground">Diziliş</p>
            </div>
            {post.description && (
              <p className="text-sm text-muted-foreground mt-3">{post.description}</p>
            )}
          </div>
        );

      default:
        return post.description ? (
          <p className="text-muted-foreground">{post.description}</p>
        ) : null;
    }
  };

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden card-hover animate-fade-in">
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-muted">
            <img src={post.avatar} alt={post.user} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.user}</span>
              <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded-full font-medium">
                {post.qorsScore}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{post.time}</span>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-10 animate-scale-in">
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-destructive hover:bg-muted w-full text-left text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="px-4 pb-3">
        <h3 className="font-bold text-lg">{post.title}</h3>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">{renderContent()}</div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {post.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onLike}
            className={`flex items-center gap-1.5 transition-all ${
              post.isLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current animate-bounce-subtle' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-info transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </button>
        </div>
        <button
          onClick={onSave}
          className={`transition-all ${
            post.isSaved ? 'text-warning' : 'text-muted-foreground hover:text-warning'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          comments={post.comments}
          onAddComment={onAddComment}
        />
      )}
    </article>
  );
}
