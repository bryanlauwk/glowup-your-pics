import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Heart, Users, Activity, Mountain, Sparkles, TrendingUp, Award, Eye, Zap, Star, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';

export const DatingTipsSidebar = () => {
  const [visibleCards, setVisibleCards] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Animate cards on load
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleCards(prev => prev + 1);
    }, 150);

    return () => clearInterval(timer);
  }, []);

  const photoRules = [
    {
      id: 'the-hook',
      title: 'The Hook',
      subtitle: 'First 3 seconds decide everything',
      icon: Target,
      color: 'text-rose-500',
      gradient: 'from-rose-500/10 to-rose-600/5',
      border: 'border-rose-500/30',
      successRate: 89,
      impact: 'Critical',
      keyTips: [
        'Eye contact = instant connection',
        'Genuine smile beats perfect teeth',
        'Golden hour lighting is magic'
      ],
      stats: { views: '2.3x more', matches: '+156%' }
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Magnet',
      subtitle: 'Show your world, not just your face',
      icon: Activity,
      color: 'text-blue-500',
      gradient: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/30',
      successRate: 76,
      impact: 'High',
      keyTips: [
        'Action shots > static poses',
        'Hobbies reveal personality',
        'Environment tells your story'
      ],
      stats: { conversations: '+89%', depth: '3x longer' }
    },
    {
      id: 'social-proof',
      title: 'Social Magnetism',
      subtitle: 'People want what others want',
      icon: Users,
      color: 'text-green-500',
      gradient: 'from-green-500/10 to-green-600/5',
      border: 'border-green-500/30',
      successRate: 82,
      impact: 'High',
      keyTips: [
        'You as the clear star',
        'Fun group dynamics',
        '2-3 people max in frame'
      ],
      stats: { trust: '+67%', appeal: '2.1x higher' }
    },
    {
      id: 'adventure',
      title: 'Adventure Spirit',
      subtitle: 'Wanderlust is irresistible',
      icon: Mountain,
      color: 'text-orange-500',
      gradient: 'from-orange-500/10 to-orange-600/5',
      border: 'border-orange-500/30',
      successRate: 71,
      impact: 'Medium',
      keyTips: [
        'Epic backdrops tell stories',
        'Action over posing',
        'Authentic exploration moments'
      ],
      stats: { intrigue: '+94%', messages: '2.4x more' }
    },
    {
      id: 'confidence',
      title: 'Confidence Code',
      subtitle: 'Inner confidence shows externally',
      icon: Star,
      color: 'text-violet-500',
      gradient: 'from-violet-500/10 to-violet-600/5',
      border: 'border-violet-500/30',
      successRate: 85,
      impact: 'Critical',
      keyTips: [
        'Posture speaks volumes',
        'Comfortable in your skin',
        'Authentic self-expression'
      ],
      stats: { attraction: '+112%', quality: '3.2x better' }
    }
  ];

  const proInsights = [
    { icon: Eye, stat: '73%', label: 'decide in 3 seconds', color: 'text-red-500' },
    { icon: Zap, stat: '5-7', label: 'photos for success', color: 'text-blue-500' },
    { icon: TrendingUp, stat: '40%', label: 'more matches with variety', color: 'text-green-500' },
    { icon: Trophy, stat: '89%', label: 'prefer natural shots', color: 'text-orange-500' }
  ];

  return (
    <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 scroll-smooth">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-violet-purple/10 to-hot-pink/10 border-violet-purple/30 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-purple" />
            Photo Psychology Secrets
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Data-driven insights from 10M+ successful profiles
          </p>
        </CardHeader>
      </Card>

      {/* Pro Insights Grid */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Success Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {proInsights.map((insight, idx) => (
              <div 
                key={idx}
                className={`text-center p-3 rounded-lg bg-muted/20 border border-border/30 transition-all duration-300 ${
                  idx < visibleCards ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
              >
                <insight.icon className={`w-5 h-5 mx-auto mb-1 ${insight.color}`} />
                <div className={`text-lg font-bold ${insight.color}`}>{insight.stat}</div>
                <div className="text-xs text-muted-foreground">{insight.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Rules Cards */}
      <div className="space-y-3">
        {photoRules.map((rule, idx) => {
          const Icon = rule.icon;
          const isVisible = idx + 4 < visibleCards;
          const isHovered = hoveredCard === rule.id;
          
          return (
            <Card 
              key={rule.id}
              className={`transition-all duration-500 cursor-pointer transform ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              } ${isHovered ? 'scale-[1.02] shadow-lg' : ''} ${rule.border} bg-gradient-to-r ${rule.gradient}`}
              onMouseEnter={() => setHoveredCard(rule.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm`}>
                    <Icon className={`w-5 h-5 ${rule.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-sm">{rule.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-0.5 ${
                          rule.impact === 'Critical' ? 'bg-red-500/20 text-red-700' :
                          rule.impact === 'High' ? 'bg-orange-500/20 text-orange-700' :
                          'bg-blue-500/20 text-blue-700'
                        }`}
                      >
                        {rule.impact}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">{rule.subtitle}</p>
                    
                    {/* Success Rate Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className={`font-semibold ${rule.color}`}>{rule.successRate}%</span>
                      </div>
                      <Progress value={rule.successRate} className="h-2" />
                    </div>
                    
                    {/* Key Tips */}
                    <div className="space-y-1 mb-3">
                      {rule.keyTips.map((tip, tipIdx) => (
                        <div key={tipIdx} className="flex items-start gap-2 text-xs">
                          <span className={`${rule.color} mt-0.5 font-bold`}>•</span>
                          <span className="text-muted-foreground">{tip}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex gap-4 pt-2 border-t border-border/30">
                      {Object.entries(rule.stats).map(([key, value]) => (
                        <div key={key} className="text-center flex-1">
                          <div className={`text-xs font-bold ${rule.color}`}>{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Pro Tip */}
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-primary mb-1">Expert Secret</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your photo sequence should tell a story: Who you are (hook) → What you love (passion) → 
                Who you're with (social) → Where you go (adventure) → How you feel (confidence). 
                <span className="text-primary font-medium"> This creates emotional investment.</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};