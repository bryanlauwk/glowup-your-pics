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
import { User, Activity, Mountain, Users, Camera, Compass } from 'lucide-react';

type PhotoCategory = 'headshot' | 'lifestyle-fullbody' | 'background-scenery' | 'lifestyle-activity' | 'social-friends' | 'adventure-travel';

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (category: PhotoCategory) => void;
  slotType: 'primary' | 'secondary';
}

const primaryCategories = [
  {
    id: 'headshot' as const,
    name: 'Headshot/Close-up',
    description: 'Face-forward, clear, confident expression',
    icon: User,
    tips: 'Best for main profile photos, eye contact, natural lighting',
    color: 'bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'lifestyle-fullbody' as const,
    name: 'Lifestyle/Full-body',
    description: 'Show your physique and style in natural setting',
    icon: Activity,
    tips: 'Great for showing personality, fashion sense, and body language',
    color: 'bg-green-500/10 border-green-500/30'
  }
];

const secondaryCategories = [
  {
    id: 'background-scenery' as const,
    name: 'Background/Scenery',
    description: 'Beautiful backgrounds and scenic locations',
    icon: Mountain,
    tips: 'Showcases your taste and travel experiences',
    color: 'bg-emerald-500/10 border-emerald-500/30'
  },
  {
    id: 'lifestyle-activity' as const,
    name: 'Lifestyle/Activity',
    description: 'Hobbies, sports, or daily activities',
    icon: Activity,
    tips: 'Great conversation starter, shows your interests',
    color: 'bg-orange-500/10 border-orange-500/30'
  },
  {
    id: 'social-friends' as const,
    name: 'Social/Friends',
    description: 'With friends or in social settings',
    icon: Users,
    tips: 'Social proof, but make sure you\'re clearly identifiable',
    color: 'bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'adventure-travel' as const,
    name: 'Adventure/Travel',
    description: 'Travel photos and adventure activities',
    icon: Compass,
    tips: 'Shows adventurous side and interesting lifestyle',
    color: 'bg-pink-500/10 border-pink-500/30'
  }
];

export const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onCategorySelect,
  slotType
}) => {
  const categories = slotType === 'primary' ? primaryCategories : secondaryCategories;

  const handleCategorySelect = (category: PhotoCategory) => {
    onCategorySelect(category);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-violet-purple" />
            Select Photo Category
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <p>
                <span className="font-medium">{slotType === 'primary' ? 'Primary Photo' : 'Secondary Photo'}</span>
                {slotType === 'primary' ? ' (Required)' : ' (Optional)'}
              </p>
              <p className="text-sm">
                {slotType === 'primary' 
                  ? 'Your main profile photo - this will be the first impression!'
                  : 'Additional photo to showcase your lifestyle and personality'
                }
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