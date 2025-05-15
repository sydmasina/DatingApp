import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { GetUsersEndpoint } from '../constants/api-enpoints/user';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _isFetchingUserData = signal<boolean>(false);
  public readonly isFetchingUserData: Signal<boolean> =
    this._isFetchingUserData.asReadonly();

  //Initialize signals
  private readonly _users = signal<User[]>([]);
  public readonly users: Signal<User[]> = this._users.asReadonly();
  private readonly _user = signal<User | null>(null);
  public readonly user: Signal<User | null> = this._user.asReadonly();
  private readonly _loggedInUserData = signal<User | null>(null);
  public readonly loggedInUserData: Signal<User | null> =
    this._loggedInUserData.asReadonly();

  constructor(private _httpClient: HttpClient) {}

  fetchUsers() {
    if (this.isFetchingUserData()) {
      return;
    }

    this._isFetchingUserData.set(true);

    return this._httpClient.get<User[]>(GetUsersEndpoint).subscribe({
      next: (response) => {
        this._users.set(response);
      },
      error: (error) => console.log(error),
      complete: () => {
        this._isFetchingUserData.set(false);
      },
    });
  }

  fetchUserByUsername(username: string) {
    if (this.isFetchingUserData()) {
      return;
    }

    this._isFetchingUserData.set(true);

    return this._httpClient
      .get<User>(GetUsersEndpoint + '/' + username)
      .subscribe({
        next: (response) => {
          this._user.set(response);
        },
        error: () => {},
        complete: () => {
          this._isFetchingUserData.set(false);
        },
      });
  }

  fetchCurrentUserData(username: string) {
    if (this.isFetchingUserData()) {
      return;
    }

    this._isFetchingUserData.set(true);

    this._httpClient.get<User>(GetUsersEndpoint + '/' + username).subscribe({
      next: (response) => {
        this._loggedInUserData.set(response);
      },
      error: () => {},
      complete: () => {
        this._isFetchingUserData.set(false);
      },
    });
  }
}
