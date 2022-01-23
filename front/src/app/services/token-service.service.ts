import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  signOut(): void {
    localStorage.clear();
  }

  public saveToken(token: string): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Токен в методе saveToken ', localStorage.getItem(TOKEN_KEY) as string);
  }

  public getToken(): string {
    // return <string> localStorage.getItem(TOKEN_KEY);
    console.log('Токен в методе getToken ', localStorage.getItem(TOKEN_KEY) as string);
    return localStorage.getItem(TOKEN_KEY) as string;
  }

  public saveUser(user: any): void {
    localStorage.removeItem(user);
    localStorage.setItem('user', user);
  }

  public getUser(): string {
    return String(localStorage.getItem('user'));
  }
}
