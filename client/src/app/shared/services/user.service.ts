import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { UsersEndpoint } from '../constants/api-enpoints/user';
import { UpdateUserDto, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _isFetchingUserData = signal<boolean>(false);
  public readonly isFetchingUserData: Signal<boolean> =
    this._isFetchingUserData.asReadonly();
  private readonly _isUpdatingUser = signal<boolean>(false);
  public readonly isUpdatingUser: Signal<boolean> =
    this._isUpdatingUser.asReadonly();

  //Initialize signals
  private readonly _users = signal<User[]>([]);
  public readonly users: Signal<User[]> = this._users.asReadonly();
  private readonly _user = signal<User | null>(null);
  public readonly user: Signal<User | null> = this._user.asReadonly();

  constructor(private _httpClient: HttpClient) {}

  fetchUsers() {
    if (this.isFetchingUserData()) {
      return;
    }

    this._isFetchingUserData.set(true);

    return this._httpClient.get<User[]>(UsersEndpoint).subscribe({
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
      .get<User>(UsersEndpoint + '/' + username)
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

  submitUpdateUserData(username: string, updateUserDto: UpdateUserDto) {
    if (this.isUpdatingUser()) {
      return;
    }

    this._isUpdatingUser.set(true);

    const params = new HttpParams().set('username', username);

    this._httpClient
      .post(UsersEndpoint + '/' + username, updateUserDto)
      .subscribe({
        next: (response) => {},
        error: () => {},
        complete: () => {
          this._isUpdatingUser.set(false);
        },
      });
  }
}
