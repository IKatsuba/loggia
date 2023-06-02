import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { injectLogger, Logger, LogLevel } from '@loggia/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule],
  selector: 'loggia-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  logger = injectLogger(AppComponent.name);
  otherLogger = inject(Logger);
  http = inject(HttpClient);

  constructor() {
    this.logger.debug('This is a log message');

    this.logger.logLevel = LogLevel.None;

    this.logger.log('This is a log message');
    this.logger.info('This is an info message');

    this.otherLogger.debug('This is a log message');

    this.otherLogger.logLevel = LogLevel.Debug;

    this.otherLogger.log('This is a log message');
    this.otherLogger.info('This is an info message');
  }
}
