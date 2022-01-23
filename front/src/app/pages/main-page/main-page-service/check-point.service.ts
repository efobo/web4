import {Injectable} from '@angular/core';
import { map } from 'rxjs/operators';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckPointService {

  constructor(private _http: HttpClient) {
  }

  public checkPoints = (data: any) => this._http.post('http://localhost:21232/checkPoint', data).pipe(
    map(
      // res => res.json(),
      res => res,
      (err: any) => this.handleError(err)
    )
  )

  public handleError = (err: any) => {
    Observable.throw(err || 'ERROR 500');
  }
}
