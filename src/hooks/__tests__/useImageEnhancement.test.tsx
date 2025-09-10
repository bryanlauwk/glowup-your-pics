import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useImageEnhancement } from '@/hooks/useImageEnhancement';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: { enhancedImageUrl: 'test-url' },
        error: null
      })
    }
  }
}));

describe('useImageEnhancement Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useImageEnhancement());
    
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.progress).toBe(0);
  });

  it('provides enhancement functions', () => {
    const { result } = renderHook(() => useImageEnhancement());
    
    expect(typeof result.current.enhanceImage).toBe('function');
    expect(typeof result.current.resetState).toBe('function');
  });
});