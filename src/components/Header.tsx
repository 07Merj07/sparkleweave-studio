import { Search, Plus } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onOpenModal: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function Header({
  activeCategory,
  setActiveCategory,
  onOpenModal,
  searchTerm,
  setSearchTerm,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border px-8 py-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">
          <span className="gradient-text">QORS</span> Feed
        </h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search-input"
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-surface border-border focus:border-primary"
            />
          </div>
          <Button onClick={onOpenModal} className="gap-2 shadow-glow">
            <Plus className="w-4 h-4" />
            Maç Oluştur
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${activeCategory === cat.id
                ? 'bg-primary text-primary-foreground shadow-glow'
                : 'bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </header>
  );
}
