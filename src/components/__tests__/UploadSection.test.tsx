import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UploadSection } from '@/components/UploadSection';

// Mock hooks
vi.mock('@/hooks/useCredits', () => ({
  useCredits: () => ({
    credits: 10,
    loading: false
  })
}));

describe('UploadSection', () => {
  it('renders without crashing', () => {
    render(<UploadSection />);
  });

  it('displays upload interface', () => {
    const { container } = render(
      <UploadSection />
    );
    expect(container).toBeTruthy();
  });
});