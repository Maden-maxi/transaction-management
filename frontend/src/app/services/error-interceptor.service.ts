import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(private notificationService: NotificationsService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(errResonse => {

        const { error } = errResonse;
        const { message, messages } = error;

        if (messages) {
          this.notificationService.error(messages.join('\r\n'));
        } else {
          this.notificationService.error(message);
        }

        return throwError(errResonse);
      })
    );
  }
}
