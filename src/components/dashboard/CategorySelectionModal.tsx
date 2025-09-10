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
import { Target, Heart, Users, Activity, Mountain, Sparkles } from 'lucide-react';

type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: PhotoCategory) => void;
  slotIndex: number;
}

const categories = [
  {
    id: 'the-hook' as const,
    name: 'The Perfect First Impression',
    description: 'Your best headshot - crisp, smiling, well-lit with visible eyes',
    icon: Target,
    tips: 'This is your swipe-right photo! Eye contact and genuine smile are key',
    color: 'bg-pink-500/10 border-pink-500/30'
  },
  {
    id: 'style-confidence' as const,
    name: 'Show Your Style & Confidence',
    description: 'Full-body shot showing your fashion sense and confidence',
    icon: Heart,
    tips: 'Avoid mirror selfies! Show your style in a natural setting',
    color: 'bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'social-proof' as const,
    name: 'Social Butterfly',
    description: 'Fun shot with friends (max 2-3 people)',
    icon: Users,
    tips: 'Shows you\'re social and fun, but make sure you\'re clearly the focus',
    color: 'bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'passion-hobbies' as const,
    name: 'Your Passion & Hobbies',
    description: 'Action shot doing something you love',
    icon: Activity,
    tips: 'Perfect conversation starter! Shows your interests and active lifestyle',
    color: 'bg-green-500/10 border-green-500/30'
  },
  {
    id: 'lifestyle-adventure' as const,
    name: 'Adventure & Lifestyle',
    description: 'Travel or outdoor activities showing your adventurous side',
    icon: Mountain,
    tips: 'Signals ambition and curiosity - very attractive qualities!',
    color: 'bg-orange-500/10 border-orange-500/30'
  },
  {
    id: 'personality-closer' as const,
    name: 'Personality Plus',
    description: 'With pets, genuine laughter, or something uniquely you',
    icon: Sparkles,
    tips: 'End on a memorable note! Shows your fun, authentic personality',
    color: 'bg-violet-500/10 border-violet-500/30'
  }
];

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onCategorySelect,
  slotIndex
}) => {

  const handleCategorySelect = (category: PhotoCategory) => {
    onCategorySelect(category);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-purple" />
            What kind of photo is this?
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Photo #{slotIndex + 1}</span> in your dating lineup
              </p>
              <p className="text-sm">
                Choose the category that best describes this photo so we can optimize it perfectly for dating apps.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${category.color}`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-violet-purple" />
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      💡 {category.tips}
                    </Badge>
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