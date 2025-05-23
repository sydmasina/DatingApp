import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import {
  LoginEndpoint,
  RegisterEndpoint,
} from '../constants/api-enpoints/auth';
import { LoggedInUser, Login } from '../models/login';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<LoggedInUser | null>(null);

  constructor(private _httpClient: HttpClient) {}

  login(loginModel: Login) {
    return this._httpClient.post<LoggedInUser>(LoginEndpoint, loginModel).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    );
  }

  register(registerModel: Register) {
    return this._httpClient
      .post<LoggedInUser>(RegisterEndpoint, registerModel)
      .pipe(
        map((user) => {
          if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            this.currentUser.set(user);
          }
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn() {
    const user = localStorage.getItem('user');
    return user ? true : false;
  }
}
