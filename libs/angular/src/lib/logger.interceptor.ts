import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { injectLogger } from './logger.service';

export const HTTP_LOG_ENABLED = new HttpContextToken(() => true);

export function withoutHttpLog(context?: HttpContext): HttpContext {
  const currentContext = context ?? new HttpContext();

  return currentContext.set(HTTP_LOG_ENABLED, false);
}

export function loggerInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  if (!req.context.get(HTTP_LOG_ENABLED)) {
    return next(req);
  }

  const logger = injectLogger('LoggerInterceptor');

  logger.log(`HTTP Request ${req.method} ${req.url}`, {
    request: req,
  });

  return next(req).pipe(
    tap({
      next: (response) => {
        if (response.type !== HttpEventType.Response) {
          return;
        }

        logger.log(`HTTP Response ${req.method} ${req.url}`, {
          request: req,
          response,
        });
      },
    })
  );
}
