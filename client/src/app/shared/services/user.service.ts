import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersEndpoint } from '../constants/api-enpoints/user';
import { PaginatedResult } from '../models/pagination';
import { PhotoToDelete, PhotoToUpload } from '../models/Photo';
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
  private readonly _paginatedUsers = signal<PaginatedResult<User[]> | null>(
    null
  );
  public readonly paginatedUsers: Signal<PaginatedResult<User[]> | null> =
    this._paginatedUsers.asReadonly();
  private readonly _user = signal<User | null>(null);
  public readonly user: Signal<User | null> = this._user.asReadonly();

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  fetchUsers(pageNumber?: number, pageSize?: number, gender?: string) {
    if (this.isFetchingUserData()) {
      return;
    }
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    if (gender) {
      params = params.append('gender', gender);
    }

    this._isFetchingUserData.set(true);

    return this._httpClient
      .get<User[]>(UsersEndpoint, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          this._paginatedUsers.set({
            items: response.body as User[],
            pagination: JSON.parse(response.headers.get('Pagination')!),
          });
          this._isFetchingUserData.set(false);
        },
        error: (error) => {
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
    imagesToUpload: PhotoToUpload[]
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
        this.toastr.success('Profile updated successfully.', undefined, {
          positionClass: 'toast-bottom-right',
        });

        this.router.navigate(['/members']);
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
    imagesToAdd: PhotoToUpload[],
    imagesToDelete: PhotoToDelete[]
  ) {
    if (imagesToAdd.length > 0) {
      for (let i = 0; i < imagesToAdd.length; i++) {
        formData.append(
          `imagesToUpload[${i}].PhotoFile`,
          imagesToAdd[i].photoFile,
          imagesToAdd[i].photoFile.name
        );
        formData.append(
          `imagesToUpload[${i}].IsMain`,
          imagesToAdd[i].isMain.toString()
        );
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
