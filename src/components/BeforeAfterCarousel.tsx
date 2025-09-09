import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for before/after examples
const beforeAfterExamples = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    after: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
    improvement: "+240% more matches",
    testimonial: "Holy shit, this actually works! Got 3 dates this week.",
    name: "Jake, 25"
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face",
    after: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face",
    improvement: "+180% more likes",
    testimonial: "Went from 2 matches to 20+ matches in one day. Insane!",
    name: "Mike, 28"
  },
  {
    id: 3,
    before: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop&crop=face",
    after: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=400&h=500&fit=crop&crop=face",
    improvement: "+300% more swipes",
    testimonial: "Finally getting the attention I deserve. This is a game changer.",
    name: "Sarah, 24"
  },
];

export const BeforeAfterCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % beforeAfterExamples.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => 
      prev === 0 ? beforeAfterExamples.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentExample = beforeAfterExamples[currentIndex];

  return (
    <div className="py-20 bg-gradient-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-accent">
              Stunning Transformations
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how our invisible AI enhancement helps real people get better matches.
              Your confidence boost is just one upload away.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Before/After Images */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Before Image */}
                      <div className="space-y-2">
                        <div className="relative group">
                          <img
                            src={currentExample.before}
                            alt="Before enhancement"
                            className={cn(
                              "w-full h-64 object-cover rounded-lg border-2 border-destructive/50 transition-all duration-500",
                              isAnimating && "scale-95 opacity-50"
                            )}
                          />
                          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-semibold">
                            BEFORE
                          </div>
                        </div>
                      </div>

                      {/* After Image */}
                      <div className="space-y-2">
                        <div className="relative group">
                          <img
                            src={currentExample.after}
                            alt="After enhancement"
                            className={cn(
                              "w-full h-64 object-cover rounded-lg border-2 border-rose-gold shadow-glow-rose transition-all duration-500",
                              isAnimating && "scale-105"
                            )}
                          />
                          <div className="absolute top-2 left-2 bg-rose-gold text-primary-foreground px-2 py-1 rounded text-sm font-semibold">
                            AFTER
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Stats */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 bg-rose-gold/20 text-rose-gold px-4 py-2 rounded-full font-bold text-lg">
                        <Star className="w-5 h-5 fill-current" />
                        {currentExample.improvement}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="space-y-6">
                    <blockquote className="text-2xl md:text-3xl font-semibold leading-relaxed">
                      "{currentExample.testimonial}"
                    </blockquote>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-rose-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <span className="text-muted-foreground">— {currentExample.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Arrows */}
            <Button
              variant="glow"
              size="icon"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full"
              disabled={isAnimating}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="glow"
              size="icon"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full"
              disabled={isAnimating}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2">
            {beforeAfterExamples.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "bg-rose-gold shadow-glow-rose"
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
                disabled={isAnimating}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};