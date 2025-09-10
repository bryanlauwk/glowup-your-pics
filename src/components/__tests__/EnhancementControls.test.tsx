import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnhancementControls } from '@/components/EnhancementControls';

// Mock the hooks
vi.mock('@/hooks/usePhotoEnhancement', () => ({
  usePhotoEnhancement: () => ({
    isProcessing: false,
    error: null,
    progress: 0,
    enhancePhoto: vi.fn(),
    resetState: vi.fn()
  })
}));

vi.mock('@/hooks/useCredits', () => ({
  useCredits: () => ({
    credits: 10,
    loading: false
  })
}));

vi.mock('@/hooks/useImageEnhancement', () => ({
  useImageEnhancement: () => ({
    isProcessing: false,
    error: null,
    enhanceImage: vi.fn()
  })
}));

describe('EnhancementControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<EnhancementControls imageDataUrl="test" onEnhancementChange={vi.fn()} />);
  });

  it('displays credit information', () => {
    const { container } = render(<EnhancementControls imageDataUrl="test" onEnhancementChange={vi.fn()} />);
    expect(container).toBeTruthy();
  });
});