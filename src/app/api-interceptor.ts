import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { HelperService } from './shared/helper.service';
import { catchError } from 'rxjs/operators';
import { InterceptorService } from './interceptor.service';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private helperService: HelperService, private interceptorService: InterceptorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('api')) {
      const url = `${this.helperService.apiUrl}/${req.url.substr(4)}`;

      const apiReq = req.clone({
        url,
        setHeaders: {
          'X-Api-Key': 'zTvkXwJSSRa5DVvTgQhaUW52DkpkeSk',
        },
        withCredentials: true,
      });

      return next.handle(apiReq).pipe(
        catchError((error) => {
          return this.errorHandler(error);
        })
      );
    }

    return next.handle(req);
  }

  private errorHandler(response: HttpResponse<any>): Observable<HttpEvent<any>> {
    if (response.status === 401) {
      this.interceptorService.logout.next();
      return of();
    }

    throw response;
  }
}
