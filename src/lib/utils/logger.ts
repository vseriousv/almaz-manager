/**
 * Simple module for logging, which can be extended in the future
 */

// Log types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Logger
class Logger {
  private enabled: boolean = true;
  private logLevel: LogLevel = 'info';
  
  constructor() {
    // In production, detailed logs can be disabled
    if (process.env.NODE_ENV === 'production') {
      this.logLevel = 'warn';
    }
  }
  
  // Enable/disable logs
  enable(enabled: boolean = true): void {
    this.enabled = enabled;
  }
  
  // Set logging level
  setLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  // Logging methods
  debug(message: string, ...args: any[]): void {
    if (!this.enabled || !this._shouldLog('debug')) return;
    console.debug(`[DEBUG] ${message}`, ...args);
  }
  
  info(message: string, ...args: any[]): void {
    if (!this.enabled || !this._shouldLog('info')) return;
    console.info(`[INFO] ${message}`, ...args);
  }
  
  warn(message: string, ...args: any[]): void {
    if (!this.enabled || !this._shouldLog('warn')) return;
    console.warn(`[WARN] ${message}`, ...args);
  }
  
  error(message: string, ...args: any[]): void {
    if (!this.enabled || !this._shouldLog('error')) return;
    console.error(`[ERROR] ${message}`, ...args);
  }
  
  // Check if the message of this level should be logged
  private _shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }
}

// Export a single logger instance
export const logger = new Logger(); 