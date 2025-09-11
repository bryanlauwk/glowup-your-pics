import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demonstration examples for AI enhancement showcase
const enhancementExamples = [
  {
    id: 1,
    before: "/api/placeholder/400/500",
    after: "/api/placeholder/400/500",
    improvement: "Enhanced Lighting",
    testimonial: "The AI subtly improved the lighting and clarity while keeping my natural look.",
    name: "Demo Enhancement"
  },
  {
    id: 2,
    before: "/api/placeholder/400/500",
    after: "/api/placeholder/400/500", 
    improvement: "Professional Quality",
    testimonial: "My photos now have that professional headshot quality without looking fake.",
    name: "Sample Result"
  },
  {
    id: 3,
    before: "/api/placeholder/400/500",
    after: "/api/placeholder/400/500",
    improvement: "Natural Enhancement",
    testimonial: "The enhancement was so natural that friends couldn't tell it was AI-edited.",
    name: "User Example"
  }
];

export const BeforeAfterCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % enhancementExamples.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => 
      prev === 0 ? enhancementExamples.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 8000); // Slower auto-advance
    return () => clearInterval(interval);
  }, []);

  const currentExample = enhancementExamples[currentIndex];

  return (
    <div className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent">
              How AI Enhancement Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI technology subtly improves photo quality while maintaining authenticity ✨
            </p>
          </div>

          {/* Process Explanation */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-violet-purple/20 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-violet-purple" />
                  </div>
                  <h3 className="text-xl font-semibold">Upload Your Photo</h3>
                  <p className="text-muted-foreground">Simply upload your existing photo - no pose or setup required</p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-violet-purple/20 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-violet-purple" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Magic Happens</h3>
                  <p className="text-muted-foreground">Our AI analyzes and enhances lighting, clarity, and natural features</p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-violet-purple/20 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-8 h-8 text-violet-purple" />
                  </div>
                  <h3 className="text-xl font-semibold">Get Enhanced Result</h3>
                  <p className="text-muted-foreground">Receive a naturally enhanced version that looks authentically you</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-violet-purple/20 text-violet-purple px-6 py-3 rounded-full font-bold text-lg">
                  <Star className="w-5 h-5 fill-current" />
                  Enhancement in 30 Seconds
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Disclaimer */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground/70">
              *Demo images for illustration purposes. Actual results may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};