import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, User, Heart, Camera, Palette } from 'lucide-react';

type PhotoCategory = 'headshot' | 'lifestyle-fullbody' | 'background-scenery' | 'lifestyle-activity' | 'social-friends' | 'adventure-travel';
type EnhancementTheme = 'professional' | 'natural' | 'attractive-dating' | 'glamour' | 'artistic';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: EnhancementTheme) => void;
  photoCategory: PhotoCategory;
  slotType: 'primary' | 'secondary';
}

const themes = [
  {
    id: 'professional' as const,
    name: 'Professional/LinkedIn',
    description: 'Clean, professional enhancement for business use',
    icon: User,
    color: 'bg-blue-500/10 border-blue-500/30',
    iconColor: 'text-blue-500',
    bestFor: 'Business profiles, LinkedIn, professional dating'
  },
  {
    id: 'natural' as const,
    name: 'Natural/Authentic',
    description: 'Subtle improvements maintaining authenticity',
    icon: Sparkles,
    color: 'bg-green-500/10 border-green-500/30',
    iconColor: 'text-green-500',
    bestFor: 'Everyday use, natural dating profiles'
  },
  {
    id: 'attractive-dating' as const,
    name: 'Attractive/Dating',
    description: 'Optimized for dating app success and appeal',
    icon: Heart,
    color: 'bg-pink-500/10 border-pink-500/30',
    iconColor: 'text-pink-500',
    bestFor: 'Tinder, Bumble, dating apps'
  },
  {
    id: 'glamour' as const,
    name: 'Glamour/Editorial',
    description: 'Dramatic enhancement for special occasions',
    icon: Camera,
    color: 'bg-purple-500/10 border-purple-500/30',
    iconColor: 'text-purple-500',
    bestFor: 'Events, parties, Instagram'
  },
  {
    id: 'artistic' as const,
    name: 'Artistic/Creative',
    description: 'Creative enhancement with artistic flair',
    icon: Palette,
    color: 'bg-orange-500/10 border-orange-500/30',
    iconColor: 'text-orange-500',
    bestFor: 'Social media, creative profiles'
  }
];

const categoryDescriptions = {
  'headshot': 'Close-up portrait optimization',
  'lifestyle-fullbody': 'Full-body lifestyle enhancement',
  'background-scenery': 'Background and scenery enhancement',
  'lifestyle-activity': 'Activity and hobby optimization',
  'social-friends': 'Social proof enhancement',
  'adventure-travel': 'Adventure and travel optimization'
};

export const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({
  isOpen,
  onClose,
  onThemeSelect,
  photoCategory,
  slotType
}) => {
  const handleThemeSelect = (theme: EnhancementTheme) => {
    onThemeSelect(theme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-purple" />
            Choose Enhancement Theme
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div>
              <span className="font-medium">{slotType === 'primary' ? 'Primary' : 'Secondary'} Photo:</span> {categoryDescriptions[photoCategory]}
            </div>
            <p>Select the enhancement style that matches your goals:</p>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${theme.color}`}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-background/50 ${theme.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-lg">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {theme.description}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {theme.bestFor}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};