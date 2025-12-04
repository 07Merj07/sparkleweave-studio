import { useState, useRef } from 'react';
import { ImagePlus, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PostComposerProps {
  newPostText: string;
  setNewPostText: (text: string) => void;
  onSharePost: (imageUrl?: string) => void;
  userAvatar: string;
}

export function PostComposer({
  newPostText,
  setNewPostText,
  onSharePost,
  userAvatar,
}: PostComposerProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = () => {
    onSharePost(selectedImage || undefined);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-surface border-b border-border p-6">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-muted">
          <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <textarea
            placeholder="Ne düşünüyorsun? Bir taktik, bir öneri veya sadece bir anı..."
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            className="w-full bg-transparent text-foreground placeholder:text-muted-foreground resize-none outline-none text-lg"
            rows={3}
          />

          {selectedImage && (
            <div className="relative mt-3 inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="max-h-48 rounded-xl border border-border"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 text-muted-foreground hover:text-primary"
              >
                <ImagePlus className="w-5 h-5" />
                Görsel
              </Button>
            </div>
            <Button
              onClick={handleShare}
              disabled={!newPostText.trim()}
              className="gap-2 shadow-glow"
            >
              <Send className="w-4 h-4" />
              Paylaş
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
