import { useState } from 'react';
import { Send } from 'lucide-react';
import { Comment } from '@/lib/data';
import { useAuth } from '@/hooks/useAuth';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { profile } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="border-t border-border bg-surface/50">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="p-4 space-y-3 max-h-60 overflow-y-auto scrollbar-thin">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <img src={comment.avatar} alt={comment.user} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 bg-muted rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{comment.user}</span>
                  <span className="text-xs text-muted-foreground">{comment.time}</span>
                </div>
                <p className="text-sm">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <form onSubmit={handleSubmit} className="p-4 flex gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-muted">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
              ?
            </div>
          )}
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Yorum yaz..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="w-9 h-9 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
