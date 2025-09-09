import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'hero', label: 'Home', icon: Zap },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'enhance', label: 'Enhance', icon: Sparkles },
    { id: 'preview', label: 'Preview', icon: Eye },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      let current = 'hero';
      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-dark-surface/80 backdrop-blur-md border border-border/50 rounded-full p-2 shadow-dark">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "relative rounded-full transition-all duration-300",
                  isActive
                    ? "bg-neon-green/20 text-neon-green shadow-glow-green"
                    : "text-muted-foreground hover:text-neon-green hover:bg-neon-green/10"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};