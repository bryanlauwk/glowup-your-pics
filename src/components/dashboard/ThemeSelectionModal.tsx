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

type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';
type EnhancementTheme = 'confident-successful' | 'authentic-approachable' | 'irresistible-magnetic' | 'stunning-sophisticated' | 'creative-unique';

interface ThemeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeSelect: (theme: EnhancementTheme) => void;
  photoCategory: PhotoCategory;
  slotIndex: number;
}

const themes = [
  {
    id: 'confident-successful' as const,
    name: 'Confident & Successful',
    description: 'Polished and professional while staying approachable',
    icon: User,
    color: 'bg-blue-500/10 border-blue-500/30',
    iconColor: 'text-blue-500',
    bestFor: 'Shows ambition and success - very attractive!'
  },
  {
    id: 'authentic-approachable' as const,
    name: 'Authentic & Approachable',
    description: 'Natural enhancements that highlight your genuine self',
    icon: Sparkles,
    color: 'bg-green-500/10 border-green-500/30',
    iconColor: 'text-green-500',
    bestFor: 'Perfect for meaningful connections and long-term dating'
  },
  {
    id: 'irresistible-magnetic' as const,
    name: 'Irresistible & Magnetic',
    description: 'Maximum appeal optimization for dating apps',
    icon: Heart,
    color: 'bg-pink-500/10 border-pink-500/30',
    iconColor: 'text-pink-500',
    bestFor: 'Get more matches on Tinder, Bumble, and Hinge!'
  },
  {
    id: 'stunning-sophisticated' as const,
    name: 'Stunning & Sophisticated',
    description: 'Elegant enhancement with dramatic flair',
    icon: Camera,
    color: 'bg-purple-500/10 border-purple-500/30',
    iconColor: 'text-purple-500',
    bestFor: 'Make a bold impression and stand out from the crowd'
  },
  {
    id: 'creative-unique' as const,
    name: 'Creative & Unique',
    description: 'Artistic enhancement that shows your creative side',
    icon: Palette,
    color: 'bg-orange-500/10 border-orange-500/30',
    iconColor: 'text-orange-500',
    bestFor: 'Perfect for creative types and unique personalities'
  }
];

const categoryDescriptions = {
  'the-hook': 'Your perfect first impression headshot',
  'style-confidence': 'Full-body confidence and style showcase',
  'social-proof': 'Social butterfly with friends',
  'passion-hobbies': 'Your passions and hobbies in action',
  'lifestyle-adventure': 'Adventure and aspirational lifestyle',
  'personality-closer': 'Authentic personality and fun side'
};

export const ThemeSelectionModal: React.FC<ThemeSelectionModalProps> = ({
  isOpen,
  onClose,
  onThemeSelect,
  photoCategory,
  slotIndex
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
            <Heart className="w-5 h-5 text-violet-purple" />
            What vibe do you want?
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div>
              <span className="font-medium">Photo #{slotIndex + 1}:</span> {categoryDescriptions[photoCategory]}
            </div>
            <p>Choose the style that matches the impression you want to make:</p>
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