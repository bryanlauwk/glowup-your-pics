import { Target, Heart, Users, Activity, Mountain, Sparkles } from 'lucide-react';

export type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';

export const photoSlots = [{
  title: "The Hook",
  subtitle: "First Impression Winner",
  description: "Your best headshot that stops the scroll",
  icon: Target,
  color: "text-rose-500",
  bgGradient: "from-rose-500/20 to-pink-500/10",
  borderColor: "border-rose-500/30",
  category: 'the-hook' as PhotoCategory,
}, {
  title: "Style & Confidence", 
  subtitle: "Full Body Appeal",
  description: "Show your style with a full-body shot",
  icon: Heart,
  color: "text-pink-500",
  bgGradient: "from-pink-500/20 to-rose-500/10",
  borderColor: "border-pink-500/30",
  category: 'style-confidence' as PhotoCategory,
}, {
  title: "Social Proof",
  subtitle: "You're Fun Company", 
  description: "With friends showing you're socially connected",
  icon: Users,
  color: "text-blue-500",
  bgGradient: "from-blue-500/20 to-cyan-500/10",
  borderColor: "border-blue-500/30",
  category: 'social-proof' as PhotoCategory,
}, {
  title: "Your Passion",
  subtitle: "Show What You Love",
  description: "Action shot of you doing what you love",
  icon: Activity,
  color: "text-green-500", 
  bgGradient: "from-green-500/20 to-emerald-500/10",
  borderColor: "border-green-500/30",
  category: 'passion-hobbies' as PhotoCategory,
}, {
  title: "Adventure Side",
  subtitle: "Your Aspirational Self",
  description: "Travel or outdoor activities",
  icon: Mountain,
  color: "text-orange-500",
  bgGradient: "from-orange-500/20 to-yellow-500/10",
  borderColor: "border-orange-500/30", 
  category: 'lifestyle-adventure' as PhotoCategory,
}, {
  title: "Personality Plus",
  subtitle: "Genuine & Fun",
  description: "With pets or genuine laughter",
  icon: Sparkles,
  color: "text-violet-500",
  bgGradient: "from-violet-500/20 to-purple-500/10",
  borderColor: "border-violet-500/30",
  category: 'personality-closer' as PhotoCategory,
}];

export const categoryPromptSuggestions: Record<PhotoCategory, string[]> = {
  'the-hook': [
    "Professional clean headshot with confident smile",
    "Warm engaging portrait with soft lighting",
    "Stylish headshot with perfect grooming"
  ],
  'style-confidence': [
    "Full body shot showcasing personal style",
    "Confident pose in stylish outfit",
    "Fashion-forward look with great posture"
  ],
  'social-proof': [
    "Natural group photo showing social connection",
    "Fun moment with friends at social event",
    "Candid shot demonstrating social charisma"
  ],
  'passion-hobbies': [
    "Action shot doing favorite hobby or sport",
    "Engaged in passionate creative activity",
    "Authentic moment pursuing personal interests"
  ],
  'lifestyle-adventure': [
    "Outdoor adventure or travel experience",
    "Active lifestyle in beautiful location",
    "Adventure sports or exploration moment"
  ],
  'personality-closer': [
    "Genuine laughter or playful moment",
    "Candid shot with pet or expressing joy",
    "Authentic personality shine through"
  ]
};