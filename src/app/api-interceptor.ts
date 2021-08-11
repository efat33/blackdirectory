import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith('api')) {
      let url = '';

      // TODO: Revert back
      // if (environment.production) {
      url = `https://68.66.248.49/~blackdir/api/${req.url.substr(4)}`;
      // } else {
      //   url = `http://localhost:3000/${req.url.substr(4)}`;
      // }

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
