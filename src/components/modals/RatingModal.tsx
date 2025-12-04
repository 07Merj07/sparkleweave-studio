import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { POSITION_CONFIG } from '@/lib/data';

interface RatingModalProps {
  onClose: () => void;
  onSubmit: (ratings: any) => void;
}

export function RatingModal({ onClose, onSubmit }: RatingModalProps) {
  const [position, setPosition] = useState('MID');
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const config = POSITION_CONFIG[position];

  const handleRating = (attrId: string, value: number) => {
    setRatings({ ...ratings, [attrId]: value });
  };

  const handleSubmit = () => {
    onSubmit({ position, ratings });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md animate-scale-in">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Maç Değerlendirmesi</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            {Object.entries(POSITION_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setPosition(key)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  position === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {config.attributes.map((attr) => (
              <div key={attr.id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{attr.label}</span>
                  <span className="text-sm text-primary">{ratings[attr.id] || 0}/10</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => handleRating(attr.id, n)}
                      className={`flex-1 h-8 rounded transition-all ${
                        (ratings[attr.id] || 0) >= n ? 'bg-primary' : 'bg-muted hover:bg-surface-hover'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleSubmit} className="w-full shadow-glow">
            <Star className="w-4 h-4 mr-2" />
            Değerlendirmeyi Gönder
          </Button>
        </div>
      </div>
    </div>
  );
}
