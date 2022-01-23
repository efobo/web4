import { Component, OnInit } from '@angular/core';
// import { StartPageService } from './start-page-service/start-page.service';
import {Router} from '@angular/router';
// import {Start} from '../registration-page/registration-page-service/registration.service';
import {StartPageService} from './start-page-service/start-page.service';
import {getUserName, saveUserName} from '../model/logic';
import {TokenService} from '../../services/token-service.service';
import {GetPointsService} from '../main-page/main-page-service/get-points.service';
import {timeout} from 'rxjs/operators';
import {AuthGuard} from '../../guard/guard';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.less']
})
export class StartPageComponent implements OnInit {
  btnIn = 'Войти';
  btnRegi = 'Зарегистрироваться';
  visibalStartinfo = true;
  visibalReg = false;
  visibalIn = false;
  usernameR: any;
  username: any;
  password: any;
  passwordR: any;
  error: string;
  console: any;



  constructor(private _service: StartPageService,
              private _router: Router, private _tokenService: TokenService, private _getPointServer: GetPointsService) {
   this.usernameR = '';
   this.username = '';
   this.password = '';
   this.passwordR = '';
   this.error = '';
  }

  ngOnInit(): void {


  }

  offStartInfo(){
    this.visibalStartinfo = false;
    this.visibalReg = false;
    this.visibalIn = false;
    this.usernameR = '';
    this.username = '';
    this.password = '';
    this.passwordR = '';
    this.error = '';
  }
  startReg(){
    this.offStartInfo();
    this.visibalReg = true;

  }
  startIn(){
    this.offStartInfo();
    this.visibalIn = true;

  }
  backInfo(){
    this.offStartInfo();
    this.visibalStartinfo = true;

  }
  public register(username: string, password: string): any {
    this.error = '';
    console.log('Метод register');
    if (!this.validation(username, password)){
    }else{
      this.sendNewUser({username, password});
      setTimeout(() => {
         if (String(this.error) === 'undefined'){
          this.auth(username, password);
        } else {
          console.log('Зашли в else в register');
          console.log(this.error);
        }
        }, 2000);
    }
  }

  public sendNewUser(obj: any): any {
    console.log('Метод sendNewUser');
    this._service.addNewUser(obj).subscribe(
      (res: any) => {
        console.log('РЕЗУЛЬТАТ');
        console.log(res);
        console.log(res, 'res');
      },
      (err: any) => {
        console.log('ЖОПАА');
        console.log(err);
        if (err.error === '[object ProgressEvent]'){
          alert('Сервер не отвечает, повторите попытку чуть позже');
        }else if (err.error !== 'Пользователь с таким именем уже зарегистрирован') {
          console.log('Зашли в нужный if');
          this.error = 'undefined';
        } else{
           this.error = err.error;
        }
      },
    );
  }



  public cleanInputValue(): void {
    this.usernameR = '';
    this.passwordR = '';
    this.username = '';
    this.password = '';
  }

  public auth(username: string, password: string): any {
    console.log('Метод auth');
    if (!this.validation(username, password)){
    }else{
      this.authorization({username, password});
    }


  }
  public getMainPage() {
    setTimeout(() => this._router.navigate(['/main']), 1000);
  }



  public authorization(obj: any): any {
    console.log('Метод authorization');
    this._service.authUser(obj).subscribe(
      (res: any) => {

        saveUserName(this.username);
        if (!(this.usernameR === 'undefined')){
          saveUserName(this.usernameR);
        }
        this._tokenService.saveToken(res.token);
        this._tokenService.saveUser(obj.username);
        this.cleanInputValue();
        this.getMainPage();
      },
      (err: any) => {
        if (err.error === '[object ProgressEvent]') {
          alert('Сервер не отвечает, повторите попытку чуть позже');
        }else {
          this.error = err.error;
          this.cleanInputValue();
        }
      },
    );
  }
  private validation(username: string, password: string): boolean{
    let flag = 1;
    username = username.replace(/\s+/g, '');
    password = password.replace(/\s+/g, '');
    if (username.length >= 4){
      if (password.length >= 4){
        this.error = '';

      }else {
        flag = 0;
        this.error = 'Password должен быть длиннее 4 символов и не содержать пробелов';
      }

    }else {
      flag = 0;
      this.error = 'Username должен быть длиннее 4 символов и не содержать пробелов';
    }
    if (flag === 1){
      return true;
    }else {
      return false;
    }



  }
}
