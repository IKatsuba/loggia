import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const CONSOLE = new InjectionToken<Console | undefined>('console', {
  factory: () => inject(DOCUMENT).defaultView?.console,
});

export type ConsoleMethod =
  | 'error'
  | 'warn'
  | 'info'
  | 'log'
  | 'debug'
  | 'trace'
  | 'table'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'count'
  | 'countReset'
  | 'time'
  | 'timeLog'
  | 'timeEnd';
