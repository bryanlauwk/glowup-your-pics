import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSwipeBoost } from '@/hooks/useSwipeBoost';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { success: true },
        error: null
      })
    }
  }
}));

describe('useSwipeBoost Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useSwipeBoost());
    
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.currentStep).toBe('idle');
    expect(result.current.progress).toBe(0);
  });

  it('provides SwipeBoost functions', () => {
    const { result } = renderHook(() => useSwipeBoost());
    
    expect(typeof result.current.enhancePhoto).toBe('function');
    expect(typeof result.current.evaluatePhoto).toBe('function');
    expect(typeof result.current.getRecipeSuggestion).toBe('function');
    expect(typeof result.current.getPolicies).toBe('function');
    expect(typeof result.current.resetState).toBe('function');
  });
});