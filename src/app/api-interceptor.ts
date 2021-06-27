import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.startsWith("api")) {
      const apiReq = req.clone({
        url: `http://localhost:3000/${req.url.substr(4)}`,
        setHeaders: {
          'X-Api-Key': 'zTvkXwJSSRa5DVvTgQhaUW52DkpkeSk',
        },
        withCredentials: true
      });

      return next.handle(apiReq);
    }

    return next.handle(req);
  }
}
