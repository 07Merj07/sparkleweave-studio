import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavIconProps {
  icon: LucideIcon;
  label: string;
  id: string;
  activeNav: string;
  onClick: (id: string) => void;
  badge?: number;
}

export function NavIcon({ icon: Icon, label, id, activeNav, onClick, badge }: NavIconProps) {
  const isActive = activeNav === id;

  return (
    <div className="relative w-full flex justify-center group">
      <button
        onClick={() => onClick(id)}
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
          isActive
            ? 'bg-primary text-primary-foreground shadow-glow'
            : 'bg-muted text-muted-foreground hover:bg-surface-hover hover:text-foreground'
        )}
      >
        <Icon className="w-5 h-5" />
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
            {badge}
          </span>
        )}
      </button>
      <span className="absolute left-full ml-3 px-2 py-1 bg-surface border border-border rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
    </div>
  );
}
