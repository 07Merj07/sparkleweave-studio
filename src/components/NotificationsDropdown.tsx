import { Bell, Star, ThumbsUp, MessageCircle, AlertCircle } from 'lucide-react';

interface NotificationsDropdownProps {
  onOpenRating: () => void;
  onOpenMatchStar: () => void;
}

export function NotificationsDropdown({ onOpenRating, onOpenMatchStar }: NotificationsDropdownProps) {
  const notifications = [
    {
      id: 1,
      type: 'like',
      icon: ThumbsUp,
      text: 'Ahmet K. gönderinizi beğendi',
      time: '2dk',
      color: 'text-destructive',
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageCircle,
      text: 'Coach Serdar yorum yaptı',
      time: '15dk',
      color: 'text-info',
    },
    {
      id: 3,
      type: 'system',
      icon: AlertCircle,
      text: 'QORS puanınız güncellendi',
      time: '1sa',
      color: 'text-primary',
    },
  ];

  return (
    <div
      className="absolute left-full top-0 ml-3 w-80 bg-popover border border-border rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Bildirimler</h3>
        </div>
        <span className="text-xs text-muted-foreground">Tümünü Gör</span>
      </div>

      <div className="max-h-80 overflow-y-auto scrollbar-thin">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 border-b border-border hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full bg-muted ${notification.color}`}>
                <notification.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{notification.text}</p>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={onOpenRating}
          className="w-full py-2 px-3 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4" />
          Maç Sonrası Değerlendirme
        </button>
        <button
          onClick={onOpenMatchStar}
          className="w-full py-2 px-3 bg-warning/10 text-warning rounded-lg text-sm font-medium hover:bg-warning/20 transition-colors flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4" />
          Maçın Yıldızını Seç
        </button>
      </div>
    </div>
  );
}
