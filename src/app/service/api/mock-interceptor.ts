// mock-interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { sampleFetchData } from './data'
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environment';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  private apiUrl = environment.apiUrl;

  intercept<T>(
    req: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    // Check if the request is to the specific mock endpoint
    if (req.url === `${this.apiUrl}/Search` && !environment.production) {
      // Check if the API key is present in the headers
      const apiKey = req.headers.get('api-key');

      if (apiKey === 'KjTFKEGi7R11DuvLSPaV16IJLfTPCkKV3qowOXtE') {
          // Check if the API key is present in the headers

        // Simulate an asynchronous operation using 'of' from RxJS
        const mockResponse = sampleFetchData;

        return of(new HttpResponse({ status: 200, body: mockResponse }) as HttpEvent<T>);
      } else {
        // API key is missing, return a forbidden response
        return throwError({ status: 403, statusText: 'Forbidden' });
      }
    }

    if (req.url.includes('/v1/login')) {
      // Check if the API key is present in the headers
      // Check if the API key is present in the headers
      const { username, password } = req.body as { username: string; password: string };
      if (username === 'testuser' && password === '@@123456') {
        return of(new HttpResponse({ status: 200, body: 'success' })as HttpEvent<T>);

      }
      else {
        // API key is missing, return a forbidden response
        return throwError({ status: 401, statusText: 'Unauthenticated' });
      }

    }
    // If the request is not to the mock endpoint, proceed with the original request
    return next.handle(req);
  }
}
