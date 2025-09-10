type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: any;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In development, use console methods for better formatting
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? console.error : 
                           level === 'warn' ? console.warn : 
                           level === 'info' ? console.info : console.log;
      
      consoleMethod(`[${level.toUpperCase()}] ${message}`, context || '');
    } else {
      // In production, use structured logging
      console.log(JSON.stringify(logEntry));
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();