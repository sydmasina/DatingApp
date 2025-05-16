import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersEndpoint } from '../constants/api-enpoints/user';
import { ApiResponse, ResultCode } from '../models/api-response';
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

  constructor(
    private _httpClient: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  fetchUsers() {
    if (this.isFetchingUserData()) {
      return;
    }

    this._isFetchingUserData.set(true);

    return this._httpClient.get<User[]>(UsersEndpoint).subscribe({
      next: (response) => {
        this._users.set(response);
        this._isFetchingUserData.set(false);
      },
      error: (error) => {
        console.log(error);
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
          this._isFetchingUserData.set(false);
          this._user.set(response);
        },
        error: () => {
          this._isFetchingUserData.set(false);
        },
      });
  }

  submitUpdateUserData(username: string, updateUserDto: UpdateUserDto) {
    if (this.isUpdatingUser()) {
      return;
    }

    this._isUpdatingUser.set(true);

    const toastOverride = {
      positionClass: 'toast-bottom-right',
      closeButton: true,
    };

    this._httpClient
      .post<ApiResponse<null>>(UsersEndpoint + '/' + username, updateUserDto)
      .subscribe({
        next: (response) => {
          this._isUpdatingUser.set(false);

          if (!response.success) {
            this.toastr.error(response.message);
            return;
          }

          switch (response.resultCode) {
            case ResultCode.Updated:
              this.toastr.success(response.message, 'Success', toastOverride);
              this.router.navigate(['/']);
              break;
            case ResultCode.NoChanges:
              this.toastr.info(response.message, undefined, toastOverride);
              this.router.navigate(['/']);
              break;
            default:
              this.toastr.warning('Unhandled result', undefined, toastOverride);
          }
        },
        error: () => {
          this.toastr.error('Something went wrong.', 'Oops...', toastOverride);
          this._isUpdatingUser.set(false);
        },
      });
  }
}
