import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { HelperService } from './shared/helper.service';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private helperService: HelperService) {}

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

      return next.handle(apiReq);
    }

    return next.handle(req);
  }
}
