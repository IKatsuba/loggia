import { ConsoleMethod } from './console';
import { LogLevel } from './logger-config';

export interface Log {
  logLevel: LogLevel;
  method: ConsoleMethod;
  message: string;
  timestamp: string;
  extra: any[];
}
