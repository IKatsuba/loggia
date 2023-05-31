import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { injectLogger } from '@loggia/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'loggia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  logger = injectLogger(this.constructor.name);
  http = inject(HttpClient);

  constructor() {
    this.logger.groupCollapsed('Hello World');
    this.logger.trace('This is a log message');
    this.logger.debug('This is a log message');
    this.logger.log('This is a log message');
    this.logger.info('This is an info message');
    this.logger.warn('This is a warn message');
    this.logger.error('This is an error message');
    this.logger.groupEnd('Hello World');

    this.http.get('/api/test').subscribe((res) => {
      //
    });
  }
}
