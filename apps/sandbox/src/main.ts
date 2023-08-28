import { appConfig } from './app/app.config';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';

import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker
  .start()
  .then(bootstrap)
  .catch((err) => console.error(err));

function bootstrap() {
  bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err)
  );
}
