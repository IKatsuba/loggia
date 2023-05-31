# @loggia

Loggia is a simple logging library for Angular 15+.

## Installation

```bash
npm install --save @loggia/angular
```

## Usage

### Basic

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideLogger, LogLevel } from '@loggia/angular';

bootstrapApplication(AppComponent, [
  provideLogger({
    level: LogLevel.DEBUG,
  }),
]);
```

### Send logs to server

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loggerInterceptor, LogLevel, provideLogger, provideServerLogger } from '@loggia/angular';

bootstrapApplication(AppComponent, [
  provideHttpClient(withInterceptors([loggerInterceptor])),
  provideLogger({
    level: LogLevel.DEBUG,
  }),
  provideServerLogger({
    url: '/api/logs',
  }),
]);
```
