import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Setup tests
beforeAll(() => {
  // Mock environment variables
  process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key';
});

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Global test cleanup
afterAll(() => {
  // Any global cleanup
});