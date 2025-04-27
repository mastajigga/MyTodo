import { defaultLoggerConfig } from '../config/logger.config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type Environment = 'development' | 'test' | 'production';

interface LogContext {
  enabled: boolean;
  description: string;
}

interface LoggerConfig {
  enabledLevels: Record<Environment, LogLevel[]>;
  contexts: Record<string, LogContext>;
  timestampFormat: string;
  retentionDays: Record<Environment, number>;
}

interface LogOptions {
  level?: LogLevel;
  context?: keyof typeof defaultLoggerConfig.contexts;
  data?: unknown;
}

export class Logger {
  private static instance: Logger;
  private env: Environment;

  private constructor() {
    this.env = (process.env.NODE_ENV as Environment) || 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return defaultLoggerConfig.enabledLevels[this.env].includes(level);
  }

  private isContextEnabled(context: keyof typeof defaultLoggerConfig.contexts): boolean {
    return defaultLoggerConfig.contexts[context].enabled;
  }

  private formatTimestamp(): string {
    const date = new Date();
    return defaultLoggerConfig.timestampFormat === 'ISO' 
      ? date.toISOString()
      : date.toLocaleString();
  }

  private log(message: string, options: LogOptions = {}): void {
    const level = options.level || 'info';
    const context = options.context;
    const data = options.data;

    if (!this.isLevelEnabled(level)) return;
    if (context && !this.isContextEnabled(context)) return;

    const timestamp = this.formatTimestamp();
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()}${context ? ` [${context}]` : ''}: ${message}`;

    switch (level) {
      case 'info':
        console.log(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
      case 'debug':
        console.debug(formattedMessage, data || '');
        break;
    }
  }

  public info(message: string, options: Omit<LogOptions, 'level'> = {}): void {
    this.log(message, { ...options, level: 'info' });
  }

  public warn(message: string, options: Omit<LogOptions, 'level'> = {}): void {
    this.log(message, { ...options, level: 'warn' });
  }

  public error(message: string, options: Omit<LogOptions, 'level'> = {}): void {
    this.log(message, { ...options, level: 'error' });
  }

  public debug(message: string, options: Omit<LogOptions, 'level'> = {}): void {
    this.log(message, { ...options, level: 'debug' });
  }
} 