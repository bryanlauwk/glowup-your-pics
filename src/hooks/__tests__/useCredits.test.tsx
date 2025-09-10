import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCredits } from '@/hooks/useCredits';
import { ReactNode } from 'react';
import '../test/mocks/supabase';
import { AuthProvider } from '@/hooks/useAuth';

// Mock the query client
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: { credits: 100 },
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: { children: ReactNode }) => children,
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useCredits Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns credits data', () => {
    const { result } = renderHook(() => useCredits(), { wrapper });
    
    expect(result.current).toHaveProperty('credits');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refetch');
  });

  it('handles loading state', () => {
    const { result } = renderHook(() => useCredits(), { wrapper });
    
    // Should have loading property
    expect(typeof result.current.loading).toBe('boolean');
  });
});