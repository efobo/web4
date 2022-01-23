import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor, HttpEvent
} from '@angular/common/http';
import {TokenService} from '../services/token-service.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _tokenService: TokenService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Зашли в интерцептор ');
    let authRequest = request;
    const token = this._tokenService.getToken();
    const username = localStorage.getItem('user') as string;
    console.log('Токен в интерцепторе ', token);
    console.log('Имя юзера  ', username);
    if (token != null) {
      authRequest = request.clone({headers: request.headers.append('Authorization', 'Bearer ' + token).append('Username', username)});
      // authRequest = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
      // authRequest = authRequest.clone({headers: request.headers.append('Username', username)});
    }
    return next.handle(authRequest);
  }
}
