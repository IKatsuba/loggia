import { ConsoleMethod } from './console';
import { LogLevel } from './logger-config';

export interface Log {
  logLevel: LogLevel;
  method: ConsoleMethod;
  message: string;
  timestamp: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra: any[];
}
