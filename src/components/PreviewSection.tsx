import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CreditCard, Download, Share2, Star, Zap } from 'lucide-react';
import { logger } from '@/lib/logger';

// Mock enhanced photos (in real app these would come from AI processing)
const mockEnhancedPhotos = [
  {
    id: 1,
    before: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face",
    after: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face",
  },
  {
    id: 2,
    before: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=500&fit=crop&crop=face",
    after: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face",
  }
];

export const PreviewSection = () => {
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = async () => {
    // In real app, this would integrate with Stripe
    logger.info('Payment process initiated', { component: 'PreviewSection' });
    // Simulate payment process
    setTimeout(() => {
      setIsPaid(true);
    }, 2000);
  };

  const handleShare = () => {
    // In real app, this would open social media sharing
    logger.info('Share options requested', { component: 'PreviewSection' });
  };

  if (isPaid) {
    return (
      <div id="preview" className="py-20 bg-gradient-glow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12 text-center">
            {/* Success Header */}
            <div className="space-y-4">
              <div className="mx-auto w-20 h-20 bg-rose-gold/20 rounded-full flex items-center justify-center">
                <Star className="w-10 h-10 text-rose-gold fill-current" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
                Your Photos Are Ready! ✨
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Download your naturally enhanced photos and watch your confidence soar!
              </p>
            </div>

            {/* Download Section */}
            <div className="grid md:grid-cols-2 gap-8">
              {mockEnhancedPhotos.map((photo) => (
                <Card key={photo.id} className="border-rose-gold/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <img
                      src={photo.after}
                      alt="Enhanced photo"
                      className="w-full h-64 object-cover rounded-lg shadow-glow-rose"
                    />
                    <Button variant="hero" className="w-full mt-4">
                      <Download className="w-5 h-5" />
                      Download High-Res
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Viral Share */}
            <Card className="border-coral/50 bg-coral/10">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Show Off Your Transformation! 💫</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Share your confidence boost and inspire others to look their best.
                  Tag us for a chance to be featured!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="romantic" size="lg" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                    Share on Instagram
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare} className="border-coral text-coral hover:bg-coral hover:text-primary-foreground">
                    <Share2 className="w-5 h-5" />
                    Share on TikTok
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="preview" className="py-20 bg-gradient-glow">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
              Your Enhanced Photos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Check out the transformation! Unlock high-resolution, watermark-free versions 
              and start getting more matches today.
            </p>
          </div>

          {/* Before/After Preview with Paywall */}
          <div className="space-y-8">
            {mockEnhancedPhotos.map((photo, index) => (
              <Card key={photo.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Before Image */}
                    <div className="space-y-4">
                      <Badge className="bg-destructive text-destructive-foreground">
                        BEFORE
                      </Badge>
                      <img
                        src={photo.before}
                        alt="Original photo"
                        className="w-full h-64 object-cover rounded-lg border-2 border-destructive/50"
                      />
                    </div>

                    {/* After Image with Watermark */}
                    <div className="space-y-4">
                      <Badge className="bg-rose-gold text-primary-foreground">
                        AFTER - ENHANCED ✨
                      </Badge>
                      <div className="relative">
                        <img
                          src={photo.after}
                          alt="Enhanced photo"
                          className="w-full h-64 object-cover rounded-lg border-2 border-rose-gold shadow-glow-rose"
                        />
                        {/* Watermark Overlay */}
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-center">
                            <Lock className="w-6 h-6 mx-auto mb-2" />
                            <p className="font-semibold">SWIPEBOOST</p>
                            <p className="text-sm opacity-80">Unlock to remove</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Paywall Card */}
          <Card className="border-rose-gold bg-gradient-dark shadow-glow-rose">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gradient-primary">
                Unlock Your Transformation
              </CardTitle>
              <p className="text-xl text-muted-foreground">
                Get high-resolution, watermark-free photos that boost your dating confidence
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Pricing */}
              <div className="text-center">
                <div className="text-5xl font-bold text-rose-gold mb-2">$9.99</div>
                <p className="text-muted-foreground">One-time payment • Instant download</p>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rose-gold" />
                  High-resolution photos (4K quality)
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rose-gold" />
                  Watermark-free downloads
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rose-gold" />
                  Ready for all dating apps
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rose-gold" />
                  Lifetime access to your photos
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={handlePayment}
                  className="w-full md:w-auto"
                >
                  <CreditCard className="w-6 h-6" />
                  Unlock My Photos Now
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Secure payment via Stripe • 30-day money-back guarantee
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};