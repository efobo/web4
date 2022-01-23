import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import { Http, Response} from '@angular/http';
import {any} from 'codelyzer/util/function';
import {TokenService} from '../../../services/token-service.service';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class StartPageService {

  constructor(private _http: HttpClient, private _tokenService: TokenService) { }

  public authUser(obj: any): any {
    return this._http.post('http://localhost:21232/login', obj).pipe(
      map(
         // res => res.json(),
        res => res,
        (err: any) => {
          this.handleError(err);
        }
      )
      // catchError(this.handleError)
    );
  }

  public addNewUser(obj: any): any {
    console.log(any());
    return this._http.post('http://localhost:21232/register', obj).pipe(
      map(
        // res => res.json(),
        res => res,
        (err: any) => {
          this.handleError(err);
        }
      )
      // catchError(this.handleError)
    );
  }

  handleError(err: any): any {
    return Observable.throw(err || 'Error 500');
    // console.log('ERROR: ', err);
    // return throwError(err);
  }

  isLoggedIn() {
    return this._tokenService.getToken() !== null;
  }

  getUser() {
    return this._tokenService.getUser();
  }

  logOut = () => {
    this._tokenService.signOut();
  }


}
