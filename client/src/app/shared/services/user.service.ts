import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetUsersEndpoint } from '../constants/api-enpoints/user';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private isFetchingUserData: boolean = false;

  //Initialize observable subjects
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(
    private _httpClient: HttpClient,
    private _authService: AuthService
  ) {}

  fetchUsers() {
    if (this.isFetchingUserData) {
      return;
    }

    this.isFetchingUserData = true;

    return this._httpClient.get<User[]>(GetUsersEndpoint).subscribe({
      next: (response) => {
        this.usersSubject.next(response);
      },
      error: (error) => console.log(error),
      complete: () => {
        console.log('Request has completed');
        this.isFetchingUserData = false;
      },
    });
  }

  fetchUserByUsername(username: string) {
    if (this.isFetchingUserData) {
      return;
    }

    this.isFetchingUserData = true;

    return this._httpClient
      .get<User>(GetUsersEndpoint + '/' + username, this.getHttpOptions())
      .subscribe({
        next: (response) => {
          this.userSubject.next(response);
        },
        error: () => {},
        complete: () => {
          this.isFetchingUserData = false;
        },
      });
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this._authService.currentUser()?.token}`,
      }),
    };
  }

  get isRunningFetchData() {
    return this.isFetchingUserData;
  }
}
