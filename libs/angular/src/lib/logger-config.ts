import { inject, InjectionToken } from '@angular/core';

export enum LogLevel {
  None,
  Error,
  Warn,
  Info,
  Debug,
  Trace,
}

export interface LoggerConfig {
  logLevel?: LogLevel;
  timestampFormat?: string;
}

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('logger.config', {
  factory: () => ({ logLevel: LogLevel.Warn }),
});

export function injectLogLevel(): LogLevel {
  return inject(LOGGER_CONFIG).logLevel ?? LogLevel.Warn;
}

export function injectDateTimeFormat(): string {
  // ISO 8601 by default
  return inject(LOGGER_CONFIG).timestampFormat ?? 'yyyy-MM-ddTHH:mm:ss.SSS';
}
