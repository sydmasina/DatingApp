import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  baseUrl = 'https://localhost:5001/api/';
 
  async login(loginModel: Login) {
    return await this.http.post(this.baseUrl + 'account/login', loginModel)
  }
}
