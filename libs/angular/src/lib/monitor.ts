import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { Log } from './log';

export interface Monitor {
  onLog(log: Log): void;
}

export const MONITORS = new InjectionToken<Monitor[]>('monitor', {
  factory: () => [],
});

export function registerLogMonitors(monitors: Monitor[]): EnvironmentProviders {
  return makeEnvironmentProviders(
    monitors.map((m) => ({ provide: MONITORS, useValue: m }))
  );
}
