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

  private logLevel = injectLogLevel();
  private dateTimeFormat = injectDateTimeFormat();
  private console = inject(CONSOLE);
  private scope: readonly string[] = this.elementName ? [this.elementName] : [];

  private monitors: readonly Monitor[] = inject(MONITORS);
  private datePipe = new DatePipe(inject(LOCALE_ID));

  write(
    logLevel: LogLevel,
    method: ConsoleMethod,
    message: string,
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

  error(message: string, ...extra: any[]) {
    this.write(LogLevel.Error, 'error', message, ...extra);
  }

  warn(message: string, ...extra: any[]) {
    this.write(LogLevel.Warn, 'warn', message, ...extra);
  }

  info(message: string, ...extra: any[]) {
    this.write(LogLevel.Info, 'info', message, ...extra);
  }

  log(message: string, ...extra: any[]) {
    this.write(LogLevel.Info, 'log', message, ...extra);
  }

  debug(message: string, ...extra: any[]) {
    this.write(LogLevel.Debug, 'debug', message, ...extra);
  }

  trace(message: string, ...extra: any[]) {
    this.write(LogLevel.Trace, 'trace', message, ...extra);
  }

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
