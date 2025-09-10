import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
      expect(result).toContain('base-class');
      expect(result).toContain('conditional-class');
      expect(result).not.toContain('hidden-class');
    });

    it('handles undefined and null values', () => {
      const result = cn('class1', undefined, null, 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('deduplicates conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-8');
      // tailwind-merge should keep only the last padding class
      expect(result).toContain('p-8');
      expect(result).not.toContain('p-4');
    });

    it('handles complex class combinations', () => {
      const result = cn(
        'bg-blue-500 text-white',
        'hover:bg-blue-600',
        'disabled:opacity-50'
      );
      
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('text-white');
      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('disabled:opacity-50');
    });
  });
});
