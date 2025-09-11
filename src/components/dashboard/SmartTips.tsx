import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Target, Heart, Users, Activity, Mountain, Sparkles, 
  ChevronDown, Lightbulb, CheckCircle, XCircle, HelpCircle 
} from 'lucide-react';
import { PhotoCategory } from './PhotoLineupStation';

interface SmartTipsProps {
  activeCategory?: PhotoCategory;
  uploadedCount: number;
}

export const SmartTips = ({ activeCategory, uploadedCount }: SmartTipsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryIcons = {
    'the-hook': Target,
    'style-confidence': Heart,
    'social-proof': Users,
    'passion-hobbies': Activity,
    'lifestyle-adventure': Mountain,
    'personality-closer': Sparkles,
  };

  const categoryTips = {
    'the-hook': {
      title: 'The Hook Tips',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      dos: [
        'Eye contact with the camera',
        'Genuine smile showing teeth',
        'Good lighting on your face'
      ],
      donts: [
        'Sunglasses or hat covering face',
        'Blurry or low-quality photos',
        'Group photos where you\'re hard to identify'
      ]
    },
    'style-confidence': {
      title: 'Style & Confidence Tips',
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      dos: [
        'Well-fitted clothes',
        'Full body visible',
        'Confident posture'
      ],
      donts: [
        'Gym selfies as main photos',
        'Messy or cluttered backgrounds',
        'Overly casual or sloppy attire'
      ]
    },
    'social-proof': {
      title: 'Social Proof Tips',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      dos: [
        'You clearly visible and centered',
        'Fun, natural interactions',
        'Upscale events or locations'
      ],
      donts: [
        'Ex-partners in the photo',
        'You hidden in the background',
        'Overly crowded group shots'
      ]
    },
    'passion-hobbies': {
      title: 'Passion & Hobbies Tips',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      dos: [
        'Action shots showing skill',
        'Professional equipment visible',
        'Dynamic, engaging poses'
      ],
      donts: [
        'Boring or static poses',
        'Poor quality action shots',
        'Unsafe or reckless activities'
      ]
    },
    'lifestyle-adventure': {
      title: 'Lifestyle & Adventure Tips',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      dos: [
        'Epic landscapes and destinations',
        'Adventure gear and activities',
        'Travel and exploration themes'
      ],
      donts: [
        'Tourist trap locations',
        'Blurry travel photos',
        'Dangerous or extreme activities'
      ]
    },
    'personality-closer': {
      title: 'Personality Plus Tips',
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      dos: [
        'Genuine laughter and joy',
        'Pets or hobbies that show character',
        'Warm, approachable energy'
      ],
      donts: [
        'Forced or fake expressions',
        'Inappropriate or offensive content',
        'Overly serious or intimidating looks'
      ]
    }
  };

  const generalTips = [
    'Upload at least 3-4 photos for the best results',
    'Mix close-ups with full-body shots',
    'Show different aspects of your personality',
    'Use recent photos (within 1-2 years)',
    'Avoid heavily filtered or edited photos'
  ];

  const currentTip = activeCategory ? categoryTips[activeCategory] : null;
  const Icon = activeCategory ? categoryIcons[activeCategory] : Lightbulb;

  return (
    <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${currentTip?.color || 'text-primary'}`} />
            <h3 className="font-semibold text-sm">
              {currentTip?.title || 'Smart Tips'}
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            {uploadedCount}/6 photos
          </Badge>
        </div>

        {/* Current Category Tips */}
        {currentTip && (
          <div className={`p-3 rounded-lg ${currentTip.bgColor} space-y-3`}>
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">Do This:</span>
              </div>
              <ul className="text-xs space-y-1 ml-4">
                {currentTip.dos.map((tip, index) => (
                  <li key={index} className="text-muted-foreground">• {tip}</li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-red-600" />
                <span className="text-xs font-medium text-red-700">Avoid:</span>
              </div>
              <ul className="text-xs space-y-1 ml-4">
                {currentTip.donts.map((tip, index) => (
                  <li key={index} className="text-muted-foreground">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* General Tips - Collapsible */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-xs h-8">
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                General Photo Tips
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2">
            <div className="bg-muted/50 p-3 rounded-lg">
              <ul className="text-xs space-y-1">
                {generalTips.map((tip, index) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-1">
                    <span className="text-primary mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Quick Action */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            💡 <span className="font-medium">Pro Tip:</span> Our AI analyzes dating app algorithms to optimize your photo appeal and matching potential.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};