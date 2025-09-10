import { Star, Heart, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Emma S.",
    age: 28,
    location: "San Francisco",
    rating: 5,
    text: "I was invisible on dating apps for months. SwipeBoost changed everything - I got 12 matches in my first day! The transformation was incredible but still looked like me. Now I'm dating someone amazing! 💕",
    matches: "12x more matches",
    avatar: "E",
    bgColor: "from-love-pink/10 to-passionate-pink/10",
    borderColor: "border-love-pink/20"
  },
  {
    id: 2,
    name: "Jake M.",
    age: 32,
    location: "New York",
    rating: 5,
    text: "As a guy, I thought dating apps were hopeless. SwipeBoost made my photos stand out without looking fake. Got 5 quality matches in the first week - including my now girlfriend! The FREE trial convinced me instantly.",
    matches: "5x more quality matches",
    avatar: "J",
    bgColor: "from-enchanting-purple/10 to-romance-rose/10",
    borderColor: "border-enchanting-purple/20"
  },
  {
    id: 3,
    name: "Sofia R.",
    age: 25,
    location: "Austin",
    rating: 5,
    text: "I was skeptical about AI photo editing, but SwipeBoost's results were magical! The photos looked amazing but natural. I went from 2-3 matches per week to 20+ matches. Now I have to be selective! ✨",
    matches: "8x more matches",
    avatar: "S",
    bgColor: "from-romance-rose/10 to-love-pink/10",
    borderColor: "border-romance-rose/20"
  }
];

export const TestimonialsSection = () => {
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
            From Invisible to Irresistible
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how SwipeBoost transformed real people's dating lives - and why they're now in love! 💕
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

                {/* Success metric */}
                <div className="bg-love-pink/20 border border-love-pink/30 rounded-lg p-3 mb-4 text-center">
                  <p className="text-love-pink font-bold text-lg">
                    {testimonial.matches}
                  </p>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-love-pink/20 text-love-pink font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.age} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-love-pink/10 to-passionate-pink/10 border border-love-pink/20 rounded-xl p-8 inline-block">
            <p className="text-lg font-semibold text-love-pink mb-2">
              Ready to join them?
            </p>
            <p className="text-muted-foreground">
              Start your FREE transformation now - no credit card required! ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};