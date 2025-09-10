import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '../mocks/supabase';

// Smoke tests to ensure critical app functionality works
describe('App Smoke Tests', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>{component}</BrowserRouter>
    );
  };

  it('renders without crashing', () => {
    renderWithRouter(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays main navigation elements', () => {
    renderWithRouter(<App />);
    // Check for main app elements that should always be present
    expect(document.querySelector('main, [role="main"], .app-content')).toBeInTheDocument();
  });

  it('handles routing without errors', () => {
    renderWithRouter(<App />);
    // Basic routing functionality should work
    expect(window.location.pathname).toBe('/');
  });

  it('loads critical components', () => {
    renderWithRouter(<App />);
    // Ensure critical components render without throwing
    const appElement = document.querySelector('#root');
    expect(appElement).toBeInTheDocument();
  });
});