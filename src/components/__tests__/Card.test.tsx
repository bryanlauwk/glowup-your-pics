import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

describe('Card Component', () => {
  it('renders card with content', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Test content</p>
        </CardContent>
      </Card>
    );

    const card = container.querySelector('.card, [role="article"], .bg-card');
    expect(card).toBeInTheDocument();
    expect(container).toHaveTextContent('Test Title');
    expect(container).toHaveTextContent('Test content');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <CardContent>Content</CardContent>
      </Card>
    );

    const card = container.firstElementChild;
    expect(card).toHaveClass('custom-class');
  });

  it('renders CardHeader and CardTitle correctly', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Header Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(container).toHaveTextContent('Header Title');
  });
});