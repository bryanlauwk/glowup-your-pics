import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders button with text', () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    const { container } = render(<Button onClick={handleClick}>Click me</Button>);
    const button = container.querySelector('button');
    
    button?.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant classes', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies correct size classes', () => {
    const { container } = render(<Button size="lg">Large Button</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('h-11');
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none');
  });
});