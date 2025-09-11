import { Link } from 'react-router-dom';
import { UserMenu } from '@/components/UserMenu';
import { useCredits } from '@/hooks/useCredits';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';

export const DashboardHeader = () => {
  const { credits } = useCredits();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="text-xl font-bold text-gradient-primary">
              💕 SwipeBoost 💕
            </div>
          </Link>

          {/* Account Info */}
          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <Badge variant="outline" className="text-sm font-medium px-3 py-1 bg-violet-purple/10 border-violet-purple/30">
              <Coins className="w-4 h-4 mr-2 text-violet-purple" />
              {credits} Credits
            </Badge>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};