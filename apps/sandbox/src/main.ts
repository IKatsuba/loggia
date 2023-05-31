import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {
  loggerInterceptor,
  LogLevel,
  provideLogger,
  provideServerLogger,
} from '@loggia/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker
  .start()
  .then(bootstrap)
  .catch((err) => console.error(err));

function bootstrap() {
  bootstrapApplication(AppComponent, {
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
  }).catch((err) => console.error(err));
}
