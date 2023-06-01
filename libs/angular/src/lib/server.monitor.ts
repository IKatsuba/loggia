import { Monitor, MONITORS } from './monitor';
import { HttpClient } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
  Injectable,
  InjectionToken,
  Injector,
  makeEnvironmentProviders,
  OnDestroy,
  ɵsetCurrentInjector as setCurrentInjector,
} from '@angular/core';
import {
  catchError,
  concatMap,
  EMPTY,
  isObservable,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { withoutHttpLog } from './logger.interceptor';
import { Log } from './log';

export type EnrichLogFn = (log: Log) => Observable<Log> | Log;

interface ServerLoggerConfig {
  url: string;
  enrichLogFns?: EnrichLogFn[];
}

export const SERVER_MONITOR_CONFIG = new InjectionToken<ServerLoggerConfig>(
  'server.monitor.config'
);

@Injectable()
export class ServerMonitor implements Monitor, OnDestroy {
  private http = inject(HttpClient);
  private config = inject(SERVER_MONITOR_CONFIG);
  private queue = new Subject<Log>();
  private injector = inject(Injector);

  private subscription = this.queue
    .pipe(
      concatMap((log) => this.enrichLog(log)),
      concatMap((log) =>
        this.http
          .post(this.config.url, log, {
            context: withoutHttpLog(),
          })
          .pipe(
            catchError((err) => {
              console.error(err);
              return EMPTY;
            })
          )
      )
    )
    .subscribe();

  private enrichLog(log: Log): Observable<Log> {
    return (this.config.enrichLogFns ?? []).reduce(
      (acc, fn) =>
        acc.pipe(
          concatMap((log) => {
            const prev = setCurrentInjector(this.injector);
            const result = fn(log);
            setCurrentInjector(prev);
            return isObservable(result) ? result : of(result);
          })
        ),
      of(log)
    );
  }

  onLog(log: Log): void {
    this.queue.next(log);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export function provideServerLogger(
  config: ServerLoggerConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SERVER_MONITOR_CONFIG,
      useValue: config,
    },
    { provide: MONITORS, useClass: ServerMonitor, multi: true },
  ]);
}
