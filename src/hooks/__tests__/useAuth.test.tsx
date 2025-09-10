import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import '../test/mocks/supabase';

// Wrapper component for testing hooks that require context
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with null user and session', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('provides auth context values', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Test that the hook returns the expected structure
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('session');
    expect(result.current).toHaveProperty('loading');
  });

  it('throws error when used outside AuthProvider', () => {
    // This should throw an error because there's no AuthProvider
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });
});