import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCredits } from '@/hooks/useCredits';
import { useAuth } from '@/hooks/useAuth';
import { TestEnhancement } from '@/components/TestEnhancement';
import { logger } from '@/lib/logger';

export const DevPanel: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState('bryanlauwk');
  const [creditsAmount, setCreditsAmount] = useState(999999);
  const { credits, refetchCredits } = useCredits();

  // Only show DevPanel for the specific user
  if (!user || user.email !== 'bryanlauwk@gmail.com') {
    return null;
  }

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
        logger.error('Admin credits error', { error: error.message });
        toast.error(`Failed: ${error.message}`);
        return;
      }

      logger.info('Admin credits response received', { success: data?.success });
      
      if (data.success) {
        toast.success(data.message);
        await refetchCredits();
      } else {
        toast.error(data.error || 'Failed to add credits');
      }
    } catch (error) {
      logger.error('Error calling admin function', { error, component: 'DevPanel', action: 'addUnlimitedCredits' });
      toast.error('Network error - check console for details');
    } finally {
      setLoading(false);
    }
  };

  const cleanupDatabase = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('photo_enhancements')
        .update({ 
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('status', 'processing');

      if (error) throw error;
      
      toast.success('Cleaned up stuck processing records');
    } catch (error) {
      logger.error('Cleanup error', { error, component: 'DevPanel', action: 'cleanupDatabase' });
      toast.error('Failed to cleanup database');
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
      <Card className="w-96 max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50 shadow-lg">
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

            <div className="flex gap-2">
              <Button
                onClick={addUnlimitedCredits}
                disabled={loading}
                className="flex-1 h-8 text-xs bg-violet-purple hover:bg-violet-purple/80"
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
              
              <Button
                onClick={cleanupDatabase}
                disabled={loading}
                variant="outline"
                className="flex-1 h-8 text-xs"
                size="sm"
              >
                Clean DB
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <TestEnhancement />
          </div>

          <div className="text-xs text-muted-foreground">
            Internal testing only - admin functions & diagnostics
          </div>
        </CardContent>
      </Card>
    </div>
  );
};