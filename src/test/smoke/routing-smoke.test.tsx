import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from '@/App';
import '../mocks/supabase';

describe('Routing Smoke Tests', () => {
  it('renders home route without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    
    expect(document.body).toBeInTheDocument();
  });

  it('renders auth route without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/auth']}>
        <App />
      </MemoryRouter>
    );
    
    expect(document.body).toBeInTheDocument();
  });

  it('handles unknown routes gracefully', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );
    
    // Should not crash and render something
    expect(document.body).toBeInTheDocument();
  });
});