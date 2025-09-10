import { describe, it, expect, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import '../mocks/supabase';

describe('Supabase Integration Smoke Tests', () => {
  it('should have supabase client configured', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(supabase.from).toBeDefined();
    expect(supabase.functions).toBeDefined();
    expect(supabase.storage).toBeDefined();
  });

  it('should have auth methods available', () => {
    expect(typeof supabase.auth.getUser).toBe('function');
    expect(typeof supabase.auth.signOut).toBe('function');
    expect(typeof supabase.auth.onAuthStateChange).toBe('function');
  });

  it('should have database query methods', () => {
    const query = supabase.from('profiles');
    expect(typeof query.select).toBe('function');
    expect(typeof query.insert).toBe('function');
    expect(typeof query.update).toBe('function');
    expect(typeof query.delete).toBe('function');
  });

  it('should have functions invoke method', () => {
    expect(typeof supabase.functions.invoke).toBe('function');
  });

  it('should handle edge function calls', async () => {
    const mockResponse = { data: { success: true }, error: null };
    vi.spyOn(supabase.functions, 'invoke').mockResolvedValue(mockResponse);

    const result = await supabase.functions.invoke('test-function', {
      body: { test: true }
    });

    expect(result).toEqual(mockResponse);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('test-function', {
      body: { test: true }
    });
  });
});