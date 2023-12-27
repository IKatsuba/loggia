import {
  ElementRef,
  EnvironmentProviders,
  inject,
  Injectable,
  Injector,
  LOCALE_ID,
  makeEnvironmentProviders,
  ɵsetCurrentInjector as setCurrentInjector,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  injectDateTimeFormat,
  injectLogLevel,
  LOGGER_CONFIG,
  LoggerConfig,
  LogLevel,
} from './logger-config';
import { CONSOLE, ConsoleMethod } from './console';
import { Monitor, MONITORS } from './monitor';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  private elementName = inject<ElementRef<HTMLElement>>(ElementRef, {
    optional: true,
  })?.nativeElement.tagName;
  private injector = inject(Injector);

  private readonly initialLogLevel = injectLogLevel();
  private _logLevel = this.initialLogLevel;
  private dateTimeFormat = injectDateTimeFormat();
  private console = inject(CONSOLE);
  private scope: readonly string[] = this.elementName ? [this.elementName] : [];

  private monitors: readonly Monitor[] = inject(MONITORS);
  private datePipe = new DatePipe(inject(LOCALE_ID));

  private parentLogger: Logger | null = null;

  get logLevel(): LogLevel {
    const logger: Logger = this.parent ?? this;
    return logger._logLevel ?? this.initialLogLevel;
  }

  set logLevel(value: LogLevel) {
    const logger: Logger = this.parent ?? this;
    logger._logLevel = value;
  }

  private get parent(): Logger {
    const parentLogger = this.parentLogger;
    return parentLogger ? parentLogger.parent : this;
  }

  write(
    logLevel: LogLevel,
    method: ConsoleMethod,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...extra: any[]
  ) {
    if (logLevel > this.logLevel) {
      return;
    }

    const timestamp = this.datePipe.transform(
      new Date(),
      this.dateTimeFormat
    ) as string;
    const context = this.scope.map((c) => `[${c}]`).join('');

    const logMessage = `${timestamp} [${method.toUpperCase()}]${context} ${message}`;
    const fn = this.console?.[method];
    if (fn) {
      fn.call(console, logMessage, ...extra);
      this.monitors.forEach((m) =>
        m.onLog({
          logLevel,
          method,
          message,
          timestamp,
          extra,
        })
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(message: string, ...extra: any[]) {
    this.write(LogLevel.Error, 'error', message, ...extra);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(message: string, ...extra: any[]) {
    this.write(LogLevel.Warn, 'warn', message, ...extra);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message: string, ...extra: any[]) {
    this.write(LogLevel.Info, 'info', message, ...extra);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log(message: string, ...extra: any[]) {
    this.write(LogLevel.Info, 'log', message, ...extra);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message: string, ...extra: any[]) {
    this.write(LogLevel.Debug, 'debug', message, ...extra);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(message: string, ...extra: any[]) {
    this.write(LogLevel.Trace, 'trace', message, ...extra);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table(tabularData?: any, properties?: string[], logLevel = LogLevel.Error) {
    this.write(logLevel, 'table', tabularData, properties);
  }

  group(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'group', label);
  }

  groupCollapsed(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'groupCollapsed', label);
  }

  groupEnd(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'groupEnd', label);
  }

  count(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'count', label);
  }

  countReset(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'countReset', label);
  }

  time(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'time', label);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timeLog(label: string, extra: any[] = [], logLevel = LogLevel.Error) {
    this.write(logLevel, 'timeLog', label, ...extra);
  }

  timeEnd(label: string, logLevel = LogLevel.Error) {
    this.write(logLevel, 'timeEnd', label);
  }

  instance(scope: string | string[]): Logger {
    const prevInjector = setCurrentInjector(this.injector);

    const logger = new Logger();
    logger.scope = [...this.scope, ...(Array.isArray(scope) ? scope : [scope])];
    logger.parentLogger = this;

    setCurrentInjector(prevInjector);

    return logger;
  }
}

export function injectLogger(scope: undefined | string | string[]): Logger {
  if (!scope) {
    return inject(Logger);
  }

  return inject(Logger).instance(scope);
}

export function provideLogger(config: LoggerConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LOGGER_CONFIG,
      useValue: config,
    },
  ]);
}
