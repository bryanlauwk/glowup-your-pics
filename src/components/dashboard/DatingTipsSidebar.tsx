import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Heart, Users, Activity, Mountain, Sparkles, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export const DatingTipsSidebar = () => {
  const [openSections, setOpenSections] = useState<string[]>(['general', 'the-hook']);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const categoryTips = [
    {
      id: 'the-hook',
      title: 'The Hook',
      icon: Target,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      dos: [
        'Close-up headshot showing your face clearly',
        'Genuine smile that reaches your eyes',
        'Good lighting (natural is best)',
        'Looking directly at camera',
        'Clean, uncluttered background'
      ],
      donts: [
        'Sunglasses or hat covering your face',
        'Group photos where you\'re hard to identify',
        'Blurry or pixelated images',
        'Bathroom mirror selfies',
        'Photos with exes (even cropped out)'
      ]
    },
    {
      id: 'style-confidence',
      title: 'Style & Confidence',
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      dos: [
        'Full body shot showing your style',
        'Well-fitted clothes that flatter you',
        'Confident posture and stance',
        'Outfit that reflects your personality',
        'Clean, polished appearance'
      ],
      donts: [
        'Baggy or ill-fitting clothes',
        'Photos from 5+ years ago',
        'Overly formal unless that\'s your style',
        'Dirty or wrinkled clothing',
        'Hiding your body entirely'
      ]
    },
    {
      id: 'social-proof',
      title: 'Social Proof',
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      dos: [
        'You as the clear focal point',
        'Having fun with friends/family',
        'At interesting events or locations',
        'Natural, candid interactions',
        'Maximum 1-2 other people in frame'
      ],
      donts: [
        'Being overshadowed by others',
        'More than 3 people in the photo',
        'Anyone more attractive stealing focus',
        'Pointing or drawing attention to others',
        'Looking uncomfortable or forced'
      ]
    },
    {
      id: 'passion-hobbies',
      title: 'Your Passion',
      icon: Activity,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      dos: [
        'Action shots of you doing what you love',
        'Showing skill and expertise',
        'Equipment/gear that shows commitment',
        'Natural environment for the activity',
        'Genuine enjoyment and focus'
      ],
      donts: [
        'Looking like a complete beginner',
        'Dangerous activities without safety gear',
        'Boring or inactive poses',
        'Generic gym selfies',
        'Activities that might be polarizing'
      ]
    },
    {
      id: 'lifestyle-adventure',
      title: 'Adventure Side',
      icon: Mountain,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      dos: [
        'Epic landscapes or travel destinations',
        'You as part of the adventure',
        'Stunning natural backgrounds',
        'Genuine exploration moments',
        'High-quality, well-composed shots'
      ],
      donts: [
        'Tourist trap cliché shots',
        'Photos where you can\'t be seen',
        'Overly filtered or edited images',
        'Showing off expensive items obtrusively',
        'Looking out of place or uncomfortable'
      ]
    },
    {
      id: 'personality-closer',
      title: 'Personality Plus',
      icon: Sparkles,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      dos: [
        'Genuine laughter and joy',
        'Interacting naturally with pets',
        'Candid moments that show character',
        'Warm, approachable expressions',
        'Photos that tell a story'
      ],
      donts: [
        'Forced or fake expressions',
        'Trying too hard to be funny',
        'Inappropriate humor or gestures',
        'Looking disinterested or bored',
        'Photos that might be misinterpreted'
      ]
    }
  ];

  const generalTips = {
    photography: [
      'Use natural lighting whenever possible',
      'Hold camera at eye level or slightly above',
      'Ensure photos are high resolution and sharp',
      'Avoid heavy filters that change your appearance',
      'Show your teeth when smiling (if comfortable)'
    ],
    psychology: [
      'First photo is 90% of your success',
      'Variety shows you\'re well-rounded',
      'Confidence is more attractive than perfection',
      'Authenticity beats trying to be someone else',
      'Update photos regularly (within 6 months)'
    ],
    common_mistakes: [
      'All photos look the same',
      'Poor photo quality or resolution',
      'Only selfies or only professional shots',
      'Hiding your face or body',
      'Photos that don\'t represent current you'
    ]
  };

  return (
    <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
      <Card className="bg-gradient-to-br from-violet-purple/5 to-hot-pink/5 border-violet-purple/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-violet-purple" />
            Dating Photo Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* General Tips */}
          <Collapsible 
            open={openSections.includes('general')} 
            onOpenChange={() => toggleSection('general')}
          >
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                <span className="font-medium text-sm">General Guidelines</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes('general') ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2">
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Photography Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {generalTips.photography.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Psychology
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {generalTips.psychology.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-red-600 flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Common Mistakes
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {generalTips.common_mistakes.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Category-Specific Tips */}
          {categoryTips.map((category) => {
            const Icon = category.icon;
            const isOpen = openSections.includes(category.id);
            
            return (
              <Collapsible 
                key={category.id}
                open={isOpen} 
                onOpenChange={() => toggleSection(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-2 h-auto">
                    <span className="flex items-center gap-2 text-sm">
                      <div className={`p-1 rounded ${category.bgColor}`}>
                        <Icon className={`w-3 h-3 ${category.color}`} />
                      </div>
                      {category.title}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-3 mt-2 pl-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Do This
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {category.dos.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-red-600 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Avoid This
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {category.donts.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">✗</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {/* Pro Tip */}
          <div className="mt-4 p-3 bg-gradient-primary/10 rounded-lg border border-violet-purple/20">
            <p className="text-xs text-muted-foreground">
              <strong className="text-violet-purple">💡 Pro Tip:</strong> Your photo lineup tells a story. 
              Make sure it shows different aspects of your personality while maintaining visual consistency 
              and authentic representation of who you are today.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};