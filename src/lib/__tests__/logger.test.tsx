import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/lib/logger';

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('logs debug messages in development', () => {
    // Mock development environment
    vi.stubEnv('MODE', 'development');
    
    logger.debug('Test debug message', { component: 'test' });
    
    expect(console.log).toHaveBeenCalledWith(
      '[DEBUG] Test debug message',
      { component: 'test' }
    );
  });

  it('logs info messages', () => {
    logger.info('Test info message', { action: 'test' });
    
    expect(console.info).toHaveBeenCalledWith(
      '[INFO] Test info message',
      { action: 'test' }
    );
  });

  it('logs warning messages', () => {
    logger.warn('Test warning message');
    
    expect(console.warn).toHaveBeenCalledWith(
      '[WARN] Test warning message',
      ''
    );
  });

  it('logs error messages', () => {
    logger.error('Test error message', { error: 'test error' });
    
    expect(console.error).toHaveBeenCalledWith(
      '[ERROR] Test error message',
      { error: 'test error' }
    );
  });

  it('does not log debug messages in production', () => {
    // Mock production environment
    vi.stubEnv('MODE', 'production');
    
    logger.debug('Test debug message');
    
    // Should use structured logging in production
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('"level":"debug"')
    );
  });
});