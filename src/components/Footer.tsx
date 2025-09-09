import React from 'react';
import { Heart, Mail, Shield, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-deep-purple/20 to-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient-primary">SwipeBoost</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The AI-powered photo enhancement tool that gives you the unfair advantage in online dating.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">How it Works</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Before & After</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">API Access</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">FAQ</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Refund Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Status Page</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-violet-purple transition-colors">Data Protection</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-border/50 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>© 2024 SwipeBoost. All rights reserved.</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Private</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a 
                  href="mailto:support@swipeboost.ai" 
                  className="flex items-center gap-2 text-muted-foreground hover:text-violet-purple transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  support@swipeboost.ai
                </a>
              </div>
            </div>
          </div>

          {/* Made with love */}
          <div className="text-center pt-4">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              Made with <Heart className="w-3 h-3 text-hot-pink fill-current" /> for better dating
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};