import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';

// Mock Supabase
const mockInvoke = vi.fn();
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: mockInvoke
    }
  }
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn()
  }
}));

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Photo Processing Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes photo enhancement end-to-end', async () => {
    mockInvoke.mockResolvedValueOnce({
      data: {
        enhancedImageUrl: 'https://example.com/enhanced.jpg',
        processingTime: '2.5s',
        enhancementId: 'test-123',
        creditsRemaining: 9
      },
      error: null
    });

    const { result } = renderHook(() => usePhotoEnhancement());

    const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...';
    const enhancePromise = result.current.enhancePhoto(testImageData, 'portrait', 'professional');

    expect(result.current.isProcessing).toBe(true);

    const enhancementResult = await enhancePromise;

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });

    expect(enhancementResult.enhancedImageUrl).toBe('https://example.com/enhanced.jpg');
    expect(enhancementResult.creditsRemaining).toBe(9);
  });

  it('handles processing errors gracefully', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('Processing failed'));

    const { result } = renderHook(() => usePhotoEnhancement());

    const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...';
    
    await expect(
      result.current.enhancePhoto(testImageData, 'portrait', 'professional')
    ).rejects.toThrow('Processing failed');

    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});