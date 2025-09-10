import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCredits } from '@/hooks/useCredits';

export const DevPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState('bryanlauwk');
  const [creditsAmount, setCreditsAmount] = useState(999999);
  const { credits, refetchCredits } = useCredits();

  const addUnlimitedCredits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-add-unlimited-credits', {
        body: {
          userIdentifier,
          credits: creditsAmount
        }
      });

      if (error) {
        console.error('Admin credits error:', error);
        toast.error(`Failed: ${error.message}`);
        return;
      }

      console.log('Admin credits response:', data);
      
      if (data.success) {
        toast.success(data.message);
        await refetchCredits();
      } else {
        toast.error(data.error || 'Failed to add credits');
      }
    } catch (error) {
      console.error('Error calling admin function:', error);
      toast.error('Network error - check console for details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-border/50"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Dev Panel
            </span>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="h-auto p-1"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              <CreditCard className="w-3 h-3 mr-1" />
              Current Credits: {credits}
            </Badge>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">User (email/id)</label>
              <Input
                value={userIdentifier}
                onChange={(e) => setUserIdentifier(e.target.value)}
                placeholder="bryanlauwk"
                className="h-8 text-xs"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Credits</label>
              <Input
                type="number"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>

            <Button
              onClick={addUnlimitedCredits}
              disabled={loading}
              className="w-full h-8 text-xs bg-violet-purple hover:bg-violet-purple/80"
              size="sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-2" />
                  Add Credits
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Internal testing only - calls admin function to set credits
          </div>
        </CardContent>
      </Card>
    </div>
  );
};