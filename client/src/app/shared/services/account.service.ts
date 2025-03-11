import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Login, LoggedInUser } from '../models/login';
import { map } from 'rxjs';
import { Register } from '../models/register';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:7159/api/';
  currentUser = signal<LoggedInUser | null>(null);
 
  login(loginModel: Login) {
    return this.http.post<LoggedInUser>(this.baseUrl + 'account/login', loginModel).pipe(
      map(user =>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    )
  }

  register(registerModel: Register) {
    return this.http.post<LoggedInUser>(this.baseUrl + 'account/register', registerModel).pipe(
      map(user =>{
        if(user){
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    )
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
