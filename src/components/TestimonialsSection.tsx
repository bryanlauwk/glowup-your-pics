import { Star, Heart, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

type Testimonial = {
  id: number;
  rating: number;
  userName: string;
  text: string;
  benefit: string;
  bgColor: string;
  borderColor: string;
};

const baseTestimonials = [
  {
    id: 1,
    text: "The AI enhancement made my photos look more professional while keeping them natural. I noticed more engagement on my profile.",
    benefit: "Better Photo Quality",
    bgColor: "from-love-pink/10 to-passionate-pink/10",
    borderColor: "border-love-pink/20"
  },
  {
    id: 2,
    text: "I was hesitant about AI photo editing, but the results were subtle and authentic. The free trial let me test it risk-free.",
    benefit: "Authentic Enhancement",
    bgColor: "from-enchanting-purple/10 to-romance-rose/10",
    borderColor: "border-enchanting-purple/20"
  },
  {
    id: 3,
    text: "The photo quality improvement was noticeable but not overdone. I appreciate that it enhanced my natural features.",
    benefit: "Natural Results",
    bgColor: "from-romance-rose/10 to-love-pink/10",
    borderColor: "border-romance-rose/20"
  }
];

const userNames = ["Alex M.", "Jordan K.", "Sam R.", "Casey L.", "Morgan P.", "Taylor W.", "Riley B.", "Drew C."];
const ratings = [4, 5];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Randomize user names and ratings
    const randomized: Testimonial[] = baseTestimonials.map(testimonial => ({
      ...testimonial,
      rating: ratings[Math.floor(Math.random() * ratings.length)],
      userName: userNames[Math.floor(Math.random() * userNames.length)]
    }));
    setTestimonials(randomized);
  }, []);

  return (
    <div className="py-20 relative overflow-hidden">
      {/* Romantic background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-love-pink/5 to-enchanting-purple/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="bg-love-pink/10 border border-love-pink/20 rounded-full px-4 py-2">
              <div className="flex items-center gap-2 text-love-pink font-semibold">
                <Heart className="w-4 h-4" />
                Real Success Stories
                <Heart className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
            What Our Users Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See why users choose SwipeBoost for authentic photo enhancement ✨
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className={`bg-gradient-to-br ${testimonial.bgColor} border ${testimonial.borderColor} hover:scale-105 transition-transform duration-300`}>
              <CardContent className="p-6">
                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-love-pink/40" />
                </div>

                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-love-pink fill-current" />
                  ))}
                </div>

                {/* Testimonial text */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Benefit highlight */}
                <div className="bg-love-pink/20 border border-love-pink/30 rounded-lg p-3 mb-4 text-center">
                  <p className="text-love-pink font-bold text-lg">
                    {testimonial.benefit}
                  </p>
                </div>

                {/* Anonymous user indicator */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-love-pink/20 text-love-pink font-semibold">
                      👤
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.userName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      SwipeBoost User
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom disclaimer and CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-love-pink/10 to-passionate-pink/10 border border-love-pink/20 rounded-xl p-8 inline-block">
            <p className="text-lg font-semibold text-love-pink mb-2">
              Try SwipeBoost Free Today
            </p>
            <p className="text-muted-foreground mb-2">
              Experience the enhancement yourself - no credit card required! ✨
            </p>
            <p className="text-xs text-muted-foreground/70">
              *Individual results may vary. Testimonials reflect user experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};