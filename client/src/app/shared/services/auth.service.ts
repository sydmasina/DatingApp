import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import {
  LoginEndpoint,
  RegisterEndpoint,
} from '../constants/api-enpoints/auth';
import { DecryptedToken, LoggedInUser, Login } from '../models/login';
import { PhotoToUpload } from '../models/Photo';
import { RegisterDto } from '../models/register';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //Inject services here
  private _httpClient = inject(HttpClient);
  private toastr = inject(ToastrService);
  private _router = inject(Router);
  private _likesService = inject(LikesService);
  private presenceService = inject(PresenceService);

  //Define signals here
  currentUser = signal<LoggedInUser | null>(null);
  private readonly _isRegistering = signal<boolean>(false);
  public readonly isRegistering: Signal<boolean> =
    this._isRegistering.asReadonly();
  roles = computed<string[] | null>(() => {
    const user = this.currentUser();
    if (user && user.token) {
      const role = jwtDecode<DecryptedToken>(user.token).role;
      return Array.isArray(role) ? role : [role];
    }
    return null;
  });

  constructor() {}

  login(loginModel: Login) {
    return this._httpClient.post<LoggedInUser>(LoginEndpoint, loginModel).pipe(
      map((user) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  register(registerDto: RegisterDto, imagesToUpload: PhotoToUpload[]) {
    if (this.isRegistering()) {
      return;
    }

    this._isRegistering.set(true);

    let fieldsFormData = this.generateFormData(registerDto);
    const finalPayload = this.appendPhotosChangesToFormData(
      fieldsFormData,
      imagesToUpload
    );

    this._httpClient
      .post<LoggedInUser>(RegisterEndpoint, finalPayload)
      .subscribe({
        next: (response) => {
          this.setCurrentUser(response);
          this._isRegistering.set(false);
          this._router.navigate(['/members']);
        },
        error: (error) => {
          this.toastr.error(
            'An unexpected error occurred while submitting request',
            'Request failed'
          );
          this._isRegistering.set(false);
        },
      });
  }

  setCurrentUser(user: LoggedInUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this._likesService.getLikeIds();
    this.presenceService.createHubConnection(user);
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
    imagesToAdd: PhotoToUpload[]
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

    return formData;
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }

  isLoggedIn() {
    const user = localStorage.getItem('user');
    return user ? true : false;
  }
}
