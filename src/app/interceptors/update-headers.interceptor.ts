import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class UpdateHeadersInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers: any = {
      'x-pointmotion-user-type': 'patient',
    }
    if (environment.name == 'local') {
      headers['x-pointmotion-debug'] = 'true'
    }
    return next.handle(request.clone({ setHeaders: headers }));
  }
}
