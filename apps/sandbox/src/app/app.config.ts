import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  loggerInterceptor,
  LogLevel,
  provideLogger,
  provideServerLogger,
} from '@loggia/angular';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([loggerInterceptor])),
    provideLogger({
      logLevel: LogLevel.Trace,
    }),
    provideServerLogger({
      url: '/api/logs',
    }),
  ],
};
