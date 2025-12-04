import { useState } from 'react';
import { X, MapPin, Clock, Users, DollarSign, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateMatchModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreateMatchModal({ onClose, onSubmit }: CreateMatchModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    date: '',
    time: '',
    playersNeeded: '2',
    price: '',
    description: '',
    urgency: 'Normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Maç Oluştur</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              placeholder="Örn: Cumartesi Akşam Maçı"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Konum</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Halısaha adı ve konumu"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="pl-10 bg-background border-border"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-background border-border"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Saat</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="players">Kaç Oyuncu?</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="players"
                  type="number"
                  min="1"
                  max="14"
                  value={formData.playersNeeded}
                  onChange={(e) => setFormData({ ...formData, playersNeeded: e.target.value })}
                  className="pl-10 bg-background border-border"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Ücret</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="price"
                  placeholder="Örn: Kişi başı 50₺"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="pl-10 bg-background border-border"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Aciliyet</Label>
            <div className="flex gap-2">
              {['Normal', 'Acil'].map((urgency) => (
                <button
                  key={urgency}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency })}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    formData.urgency === urgency
                      ? urgency === 'Acil'
                        ? 'bg-urgent text-background'
                        : 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-surface-hover'
                  }`}
                >
                  {urgency}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
            <textarea
              id="description"
              placeholder="Maç hakkında ek bilgiler..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm resize-none outline-none focus:border-primary transition-colors"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full gap-2 shadow-glow">
            <Send className="w-4 h-4" />
            Maç Oluştur
          </Button>
        </form>
      </div>
    </div>
  );
}
