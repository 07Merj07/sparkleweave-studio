import { TrendingUp, Users, Calendar, Star } from 'lucide-react';

export function Sidebar() {
  const trendingTopics = [
    { tag: '#HalıSaha', posts: '2.4K' },
    { tag: '#AmatörLig', posts: '1.8K' },
    { tag: '#MaçBul', posts: '1.2K' },
    { tag: '#Taktik', posts: '890' },
  ];

  const topPlayers = [
    { name: 'Ahmet Y.', score: 9.8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { name: 'Mehmet K.', score: 9.6, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'Ali D.', score: 9.5, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
  ];

  const upcomingMatches = [
    { teams: 'FC Mahalle vs Yıldızlar', time: 'Bugün 20:00', location: 'Etiler' },
    { teams: 'Kartal SK vs Beşiktaş', time: 'Yarın 19:00', location: 'Kadıköy' },
  ];

  return (
    <aside className="w-80 bg-surface border-l border-border p-6 overflow-y-auto scrollbar-thin hidden xl:block">
      {/* Trending */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Gündem</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-background rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <span className="font-medium text-primary">{topic.tag}</span>
              <span className="text-xs text-muted-foreground">{topic.posts} gönderi</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Players */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-warning" />
          <h3 className="font-bold">Haftanın Yıldızları</h3>
        </div>
        <div className="space-y-3">
          {topPlayers.map((player, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-background rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                </div>
                {i === 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-warning rounded-full flex items-center justify-center text-xs">
                    👑
                  </div>
                )}
              </div>
              <div className="flex-1">
                <span className="font-medium">{player.name}</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-primary font-semibold">{player.score}</span>
                  <span className="text-xs text-muted-foreground">QORS</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-info" />
          <h3 className="font-bold">Yaklaşan Maçlar</h3>
        </div>
        <div className="space-y-3">
          {upcomingMatches.map((match, i) => (
            <div
              key={i}
              className="p-3 bg-background rounded-xl hover:bg-muted transition-colors cursor-pointer"
            >
              <div className="font-medium text-sm">{match.teams}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{match.time}</span>
                <span>•</span>
                <span>{match.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
