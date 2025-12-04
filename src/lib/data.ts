export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  cover: string;
  qorsScore: number;
  fairPlayBadge: boolean;
  matchesPlayed: number;
  reliability: string;
  role: string;
  bio: string;
  stats: {
    mvp: number;
    goals: number;
    assists: number;
  };
}

export interface Comment {
  id: string;
  user: string;
  userId: string;
  avatar: string;
  text: string;
  time: string;
}

export interface Post {
  id: string;
  type: 'video' | 'lineup' | 'transfer' | 'status';
  category: string;
  user: string;
  userId: string;
  avatar: string;
  title: string;
  description?: string;
  thumbnail?: string;
  formation?: string;
  views?: number;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  time: string;
  tags?: string[];
  qorsScore: number;
  badge?: string;
  comments: Comment[];
  subType?: string;
  location?: string;
  timeSpec?: string;
  price?: string;
  urgency?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'system' | 'match_rating' | 'match_star';
  title: string;
  message?: string;
  user?: string;
  time: string;
  isRead: boolean;
}

export interface PositionAttribute {
  id: string;
  label: string;
}

export interface PositionConfig {
  label: string;
  color: string;
  attributes: PositionAttribute[];
}

export const DEFAULT_USER: User = {
  id: "default",
  name: "Yeni Kullanıcı",
  handle: "@kullanici",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
  cover: "https://images.unsplash.com/photo-1508098682722-e99c643e7f76?auto=format&fit=crop&q=80&w=1200",
  qorsScore: 5.0,
  fairPlayBadge: false,
  matchesPlayed: 0,
  reliability: "Yeni",
  role: "Orta Saha",
  bio: "Halı saha tutkunu",
  stats: { mvp: 0, goals: 0, assists: 0 },
};

export const POSITION_CONFIG: Record<string, PositionConfig> = {
  GK: {
    label: "Kaleci",
    color: "text-warning",
    attributes: [
      { id: 'reflexes', label: 'Refleksler' },
      { id: 'diving', label: 'Uzanış & Esneklik' },
      { id: 'positioning', label: 'Yer Tutma' },
      { id: 'oneonone', label: 'Birebir' }
    ]
  },
  DEF: {
    label: "Defans",
    color: "text-info",
    attributes: [
      { id: 'tackling', label: 'Müdahale (Tackle)' },
      { id: 'positioning', label: 'Pozisyon Alma' },
      { id: 'heading', label: 'Kafa Topu & Fizik' },
      { id: 'pace', label: 'Hız & Kademe' }
    ]
  },
  MID: {
    label: "Orta Saha",
    color: "text-primary",
    attributes: [
      { id: 'passing', label: 'Pas & Vizyon' },
      { id: 'dribbling', label: 'Dribbling' },
      { id: 'stamina', label: 'Dayanıklılık' },
      { id: 'control', label: 'Top Kontrolü' }
    ]
  },
  FWD: {
    label: "Forvet",
    color: "text-destructive",
    attributes: [
      { id: 'finishing', label: 'Bitiricilik' },
      { id: 'pace', label: 'Hız & Patlayıcılık' },
      { id: 'dribbling', label: 'Çalım Yeteneği' },
      { id: 'offball', label: 'Topsuz Koşu' }
    ]
  }
};

export const CATEGORIES = [
  { id: 'all', label: 'Tümü' },
  { id: 'lmg', label: '🚨 LMG (Acil)' },
  { id: 'lineup', label: '📋 Dizilişler' },
  { id: 'defense', label: '🛡️ Defans Okulu' },
  { id: 'forward', label: '⚽ Gol Yolları' },
  { id: 'freestyle', label: '🔥 Freestyle' },
];

export const SAMPLE_POSTS: Omit<Post, 'id' | 'userId' | 'isLiked' | 'isSaved'>[] = [
  {
    type: 'lineup',
    category: 'lineup',
    user: "Taktik Dehası",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=100",
    title: "7'ye 7 Maçlarda En Dengeli Diziliş: 2-3-1 📐",
    description: "Orta sahayı kalabalık tutarak hem defansa yardım ediyoruz hem de hücumda çoğalıyoruz. Kanatlar çok koşmalı!",
    formation: "2-3-1",
    likes: 540,
    time: "1 saat önce",
    tags: ["#Taktik", "#Diziliş", "#7vs7"],
    qorsScore: 9.6,
    comments: []
  },
  {
    type: 'video',
    category: 'defense',
    user: "Coach Serdar",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    thumbnail: "https://images.unsplash.com/photo-1516731237713-fc8888a371da?auto=format&fit=crop&q=80&w=800",
    title: "Defans Arkasına Atılan Topları Kesme Sanatı 🏃‍♂️",
    views: 24500,
    likes: 3200,
    time: "3 saat önce",
    tags: ["#Stoper", "#Kademe", "#Savunma"],
    qorsScore: 9.8,
    badge: "Pro Tavsiye",
    comments: []
  },
  {
    type: 'transfer',
    category: 'lmg',
    subType: 'kaleci',
    user: "FC Mahalle",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100",
    title: "BU AKŞAM KALECİ LAZIM!",
    location: "Etiler Stop Halısaha",
    timeSpec: "22:00 - 23:00",
    price: "Ücretsiz + Tatlı",
    urgency: "Acil",
    description: "Kondisyonu iyi, refleksleri sağlam bir kaleci arıyoruz. Maç saati yaklaştı!",
    qorsScore: 9.2,
    likes: 0,
    time: "30 dk önce",
    comments: []
  },
  {
    type: 'video',
    category: 'freestyle',
    user: "Sokak Futbolu TR",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100",
    thumbnail: "https://images.unsplash.com/photo-1606925797300-0b35e9d17927?auto=format&fit=crop&q=80&w=800",
    title: "Maç içinde rakibi şaşırtacak 3 basit çalım 🔥",
    views: 45000,
    likes: 5600,
    time: "2 gün önce",
    tags: ["#Freestyle", "#Skill", "#Çalım"],
    qorsScore: 8.5,
    comments: []
  },
  {
    type: 'transfer',
    category: 'lmg',
    subType: 'oyuncu',
    user: "Beşiktaş Halısaha",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    title: "2 OYUNCU ARANIYOR - YARIN AKŞAM",
    location: "Beşiktaş Yıldız Halısaha",
    timeSpec: "20:00 - 21:00",
    price: "Kişi başı 50₺",
    urgency: "Normal",
    description: "Orta saha veya defans pozisyonunda oynayabilecek 2 arkadaş arıyoruz.",
    qorsScore: 8.8,
    likes: 12,
    time: "2 saat önce",
    comments: []
  },
  {
    type: 'video',
    category: 'forward',
    user: "Gol Kralı",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    thumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    title: "Ceza Sahasında Pozisyon Alma Taktikleri ⚽",
    views: 18200,
    likes: 2100,
    time: "5 saat önce",
    tags: ["#Forvet", "#Gol", "#Taktik"],
    qorsScore: 9.1,
    badge: "Trend",
    comments: []
  }
];

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Az önce';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk önce`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} gün önce`;
  return date.toLocaleDateString('tr-TR');
}

export function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}
