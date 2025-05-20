import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersEndpoint } from '../constants/api-enpoints/user';
import { PhotoToDelete } from '../models/Photo';
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

  submitUpdateUserData(
    updateUserDto: UpdateUserDto,
    imagesToDelete: PhotoToDelete[],
    imagesToUpload: File[]
  ) {
    if (this.isUpdatingUser()) {
      return;
    }

    this._isUpdatingUser.set(true);

    let fieldsFormData = this.generateFormData(updateUserDto);
    const finalPayload = this.appendPhotosChangesToFormData(
      fieldsFormData,
      imagesToUpload,
      imagesToDelete
    );

    this._httpClient.put(UsersEndpoint, finalPayload).subscribe({
      next: (response) => {
        this._isUpdatingUser.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this._isUpdatingUser.set(false);
      },
    });
  }

  generateFormData(data: { [key: string]: any }) {
    const formData = new FormData();

    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        data[key] !== undefined &&
        data[key] !== null
      ) {
        formData.append(key, data[key]);
      }
    }

    return formData;
  }

  appendPhotosChangesToFormData(
    formData: FormData,
    imagesToAdd: File[],
    imagesToDelete: PhotoToDelete[]
  ) {
    if (imagesToAdd.length > 0) {
      for (let i = 0; i < imagesToAdd.length; i++) {
        formData.append('imagesToUpload', imagesToAdd[i], imagesToAdd[i].name);
      }
    }

    if (imagesToDelete.length > 0) {
      for (let i = 0; i < imagesToDelete.length; i++) {
        formData.append(
          `imagesToDelete[${i}].DbId`,
          imagesToDelete[i].DbId.toString()
        );
        formData.append(
          `imagesToDelete[${i}].PublicId`,
          (imagesToDelete[i].PublicId ?? '').toString()
        );
      }
    }
    return formData;
  }
}
