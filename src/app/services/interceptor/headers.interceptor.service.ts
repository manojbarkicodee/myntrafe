import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class HeadersInterceptorService implements HttpInterceptor {
  constructor(private httpservice: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let url = req.url;
    let token: string = localStorage.getItem('token') || '';

    if (token) {
      token = JSON.parse(token);
    }

    if (
      url.includes('wishlist') ||
      url.includes('cart') ||
      url.includes('address') ||
      url.includes('cards') ||
      url.includes('order')||
      url.includes('profile')
    ) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(req);
    }
    return next.handle(req);
  }
}
