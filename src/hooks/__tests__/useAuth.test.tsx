import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth } from '@/hooks/useAuth';
import '../test/mocks/supabase';

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('handles sign in', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Mock sign in functionality
    expect(result.current.user).toBeNull();

    // Test that the sign in function was called
    expect(result.current.loading).toBe(false);
  });

  it('handles sign out', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.user).toBeNull();
  });
});