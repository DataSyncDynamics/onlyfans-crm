/**
 * Structured Logging Utility
 * Provides consistent, production-ready logging with context and metadata
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  context?: string;
  meta?: any;
  stack?: string;
}

/**
 * Format log entry as readable string
 */
function formatLog(entry: LogEntry): string {
  const { level, timestamp, message, context, meta } = entry;

  // Color codes for terminal output (only in development)
  const colors = {
    info: '\x1b[36m',    // Cyan
    warn: '\x1b[33m',    // Yellow
    error: '\x1b[31m',   // Red
    debug: '\x1b[90m',   // Gray
    reset: '\x1b[0m',
  };

  const isDev = process.env.NODE_ENV === 'development';
  const color = isDev ? colors[level] : '';
  const reset = isDev ? colors.reset : '';

  // Build log string
  const parts = [
    `${color}[${level.toUpperCase()}]${reset}`,
    timestamp,
    context ? `[${context}]` : null,
    message,
  ].filter(Boolean);

  let logStr = parts.join(' ');

  // Add metadata if present
  if (meta && Object.keys(meta).length > 0) {
    const metaStr = JSON.stringify(meta, null, isDev ? 2 : 0);
    logStr += isDev ? `\n${metaStr}` : ` | ${metaStr}`;
  }

  return logStr;
}

/**
 * Sanitize sensitive data from logs
 */
function sanitizeMeta(meta: any): any {
  if (!meta) return meta;

  const sanitized = { ...meta };
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Structured Logger
 */
export const logger = {
  /**
   * Log informational message
   */
  info: (message: string, meta?: any, context?: string) => {
    const entry: LogEntry = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      context,
      meta: sanitizeMeta(meta),
    };
    console.log(formatLog(entry));
  },

  /**
   * Log error message with stack trace
   */
  error: (message: string, error?: any, context?: string) => {
    const entry: LogEntry = {
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      context,
      meta: error ? {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        ...sanitizeMeta(error),
      } : undefined,
      stack: error?.stack,
    };

    console.error(formatLog(entry));

    // Log stack trace separately for better readability
    if (entry.stack && process.env.NODE_ENV === 'development') {
      console.error(entry.stack);
    }
  },

  /**
   * Log warning message
   */
  warn: (message: string, meta?: any, context?: string) => {
    const entry: LogEntry = {
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      context,
      meta: sanitizeMeta(meta),
    };
    console.warn(formatLog(entry));
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message: string, meta?: any, context?: string) => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const entry: LogEntry = {
      level: 'debug',
      timestamp: new Date().toISOString(),
      message,
      context,
      meta: sanitizeMeta(meta),
    };
    console.debug(formatLog(entry));
  },

  /**
   * Create a child logger with persistent context
   */
  withContext: (context: string) => ({
    info: (message: string, meta?: any) => logger.info(message, meta, context),
    error: (message: string, error?: any) => logger.error(message, error, context),
    warn: (message: string, meta?: any) => logger.warn(message, meta, context),
    debug: (message: string, meta?: any) => logger.debug(message, meta, context),
  }),
};

/**
 * Create API request logger middleware
 */
export function createApiLogger(apiName: string) {
  return logger.withContext(`API:${apiName}`);
}

/**
 * Performance timer utility
 */
export function createTimer(label: string) {
  const start = Date.now();

  return {
    end: (meta?: any) => {
      const duration = Date.now() - start;
      logger.debug(`${label} completed`, { duration: `${duration}ms`, ...meta });
      return duration;
    },
  };
}
