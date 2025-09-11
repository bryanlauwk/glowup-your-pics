import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  isPopular?: boolean;
  features: string[];
  costPerCredit: number;
  savings?: string;
}

export interface CreditUsage {
  operation: string;
  cost: number;
  description: string;
  icon: string;
}

export const CREDIT_COSTS: Record<string, CreditUsage> = {
  'basic-enhancement': {
    operation: 'Basic Enhancement',
    cost: 1,
    description: 'Simple photo polish and correction',
    icon: '✨'
  },
  'scene-transformation': {
    operation: 'Scene Transformation',
    cost: 2,
    description: 'AI-powered scene and environment change',
    icon: '🎭'
  },
  'premium-transformation': {
    operation: 'Premium Transformation',
    cost: 3,
    description: 'Advanced transformation with multiple iterations',
    icon: '💎'
  },
  'bulk-processing': {
    operation: 'Bulk Processing',
    cost: 1,
    description: 'Per photo in bulk operations (discount applied)',
    icon: '📦'
  }
};

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 9.99,
    originalPrice: 14.99,
    features: ['5 Scene Transformations', '10 Basic Enhancements', 'Email Support'],
    costPerCredit: 0.99,
    savings: '33% OFF'
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 30,
    price: 24.99,
    originalPrice: 44.99,
    isPopular: true,
    features: ['15 Scene Transformations', '30 Basic Enhancements', '5 Premium Transformations', 'Priority Support'],
    costPerCredit: 0.83,
    savings: '44% OFF'
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 100,
    price: 69.99,
    originalPrice: 149.99,
    features: ['50 Scene Transformations', '100 Basic Enhancements', '20 Premium Transformations', 'Unlimited Bulk Processing', '24/7 Support'],
    costPerCredit: 0.70,
    savings: '53% OFF'
  },
  {
    id: 'unlimited',
    name: 'Unlimited Monthly',
    credits: 999999,
    price: 199.99,
    features: ['Unlimited Transformations', 'All Premium Features', 'Priority Processing', 'Custom Templates', '24/7 VIP Support'],
    costPerCredit: 0.00,
    savings: 'BEST VALUE'
  }
];

export const useCreditManagement = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [trialUsed, setTrialUsed] = useState<boolean>(false);
  const [isTrialAvailable, setIsTrialAvailable] = useState<boolean>(false);
  const [creditHistory, setCreditHistory] = useState<any[]>([]);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits, trial_used, trial_date')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setCredits(data?.credits || 0);
      setTrialUsed(data?.trial_used || false);
      setIsTrialAvailable(!data?.trial_used && data?.credits === 1);
    } catch (error) {
      logger.error('Error fetching credits', { error, hook: 'useCreditManagement', action: 'fetchCredits' });
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const canAfford = useCallback((operation: string): boolean => {
    const cost = CREDIT_COSTS[operation]?.cost || 1;
    return credits >= cost;
  }, [credits]);

  const getRecommendedPackage = useCallback((): CreditPackage => {
    if (credits < 10) return CREDIT_PACKAGES[1]; // Popular pack for low credits
    if (credits < 50) return CREDIT_PACKAGES[2]; // Pro pack for medium credits
    return CREDIT_PACKAGES[0]; // Starter for top-ups
  }, [credits]);

  const purchaseCredits = useCallback(async (packageId: string) => {
    if (!user) {
      toast.error('Please log in to purchase credits');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { packageId }
      });

      if (error) throw error;

      // Open Stripe checkout in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      logger.error('Error creating checkout', { error, hook: 'useCreditManagement', action: 'purchaseCredits', packageId });
      toast.error('Failed to start checkout process');
    }
  }, [user]);

  const deductCredits = useCallback(async (operation: string, amount?: number): Promise<boolean> => {
    if (!user) return false;

    const cost = amount || CREDIT_COSTS[operation]?.cost || 1;
    
    if (!canAfford(operation)) {
      toast.error(`Insufficient credits. Need ${cost} credits for ${CREDIT_COSTS[operation]?.operation || 'this operation'}`);
      return false;
    }

    try {
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: credits - cost })
        .eq('user_id', user.id);

      if (error) throw error;

      setCredits(prev => prev - cost);
      return true;
    } catch (error) {
      logger.error('Error deducting credits', { error, hook: 'useCreditManagement', action: 'deductCredits', operation, cost });
      toast.error('Failed to process credits');
      return false;
    }
  }, [user, credits, canAfford]);

  const addCredits = useCallback(async (amount: number, source = 'manual') => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('add-credits', {
        body: {
          userId: user.id,
          credits: amount,
          source
        }
      });

      if (error) throw error;

      setCredits(data.credits);
      toast.success(`Added ${amount} credits!`);
    } catch (error) {
      logger.error('Error adding credits', { error, hook: 'useCreditManagement', action: 'addCredits', amount, source });
      toast.error('Failed to add credits');
    }
  }, [user]);

  const getCreditUsageAnalytics = useCallback(async () => {
    if (!user) return [];

    // Return mock data for now since photo_enhancements table structure is not available
    return [
      {
        operation: 'scene-transformation',
        date: new Date().toISOString(),
        cost: 2
      }
    ];
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Listen for credit changes
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user-credits-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_credits',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            setCredits((payload.new as any).credits);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    credits,
    loading,
    trialUsed,
    isTrialAvailable,
    creditHistory,
    canAfford,
    getRecommendedPackage,
    purchaseCredits,
    deductCredits,
    addCredits,
    getCreditUsageAnalytics,
    refetchCredits: fetchCredits,
    CREDIT_COSTS,
    CREDIT_PACKAGES
  };
};