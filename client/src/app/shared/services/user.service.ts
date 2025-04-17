import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetUsersEndpoint } from '../constants/api-enpoints/user';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isFetchingUserData: boolean = false;

  constructor(private _httpClient: HttpClient) {}

  getUsers() {
    if (this.isFetchingUserData) {
      return;
    }

    this.isFetchingUserData = true;

    return this._httpClient.get<User>(GetUsersEndpoint).subscribe({
      next: (response) => {
        return response;
      },
      error: (error) => console.log(error),
      complete: () => {
        console.log('Request has completed');
        this.isFetchingUserData = false;
      },
    });
  }

  get isRunningFetchData() {
    return this.isFetchingUserData;
  }
}
