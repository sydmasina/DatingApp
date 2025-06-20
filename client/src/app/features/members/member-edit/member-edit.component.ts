import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  HostListener,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CanComponentDeactivate } from '../../../shared/_guards/unsaved-changes.guard';
import { FormDateFieldComponent } from '../../../shared/components/form-fields/form-date-field/form-date-field.component';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
import { FormInputFieldComponent } from '../../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { ImageGalleryComponent } from '../../../shared/components/form-fields/image-gallery/image-gallery.component';
import {
  max_city,
  max_country,
  max_dateOfBirth,
  max_gender,
  max_interests,
  max_introduction,
  max_knownAs,
  max_lookingFor,
  min_city,
  min_country,
  min_dateOfBirth,
  min_gender,
  min_interests,
  min_introduction,
  min_knownAs,
  min_lookingFor,
} from '../../../shared/constants/user-form-constants';
import {
  Photo,
  PhotoToDelete,
  PhotoToUpload,
} from '../../../shared/models/Photo';
import {
  UpdateUserDto,
  UserUpdateFormValues,
} from '../../../shared/models/user';
import { AuthService } from '../../../shared/services/auth.service';
import { StaticDataService } from '../../../shared/services/static-data.service';
import { UserService } from '../../../shared/services/user.service';
import { formatToDateOnly } from '../../../shared/utils/helpers';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormInputFieldComponent,
    FormSelectFieldComponent,
    FormDateFieldComponent,
    ImageGalleryComponent,
    RouterLink,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit, CanComponentDeactivate {
  userUpdateFormGroup!: FormGroup;
  GenderOptions: string[] = ['male', 'female'];
  additionalImages = signal<string[]>([]);
  mainPhoto = signal<string[]>([]);
  mainPhotoToUpload: File[] = [];
  imagesToDelete: PhotoToDelete[] = [];
  additionalImagesToUpload: File[] = [];
  Min_dateOfBirth = min_dateOfBirth;
  Max_dateOfBirth = max_dateOfBirth;
  isFormDirty = false;
  hasUploadedMainImage: boolean = false;

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.isFormDirty) {
      $event.preventDefault();
      $event.returnValue = '';
    }
  }

  constructor(
    public staticData: StaticDataService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    effect(
      () => {
        const user = this.userService.user();
        if (user) {
          this.userUpdateFormGroup.patchValue(user);
          this._initSelectedCountry(user.country);
          this._initUserPhotos(user.photos);
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this._initFormGroups();
    this.staticData.GetCountries();
    this._initUserData();
  }

  canDeactivate(): boolean {
    if (this.isFormDirty) {
      return confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
    }
    return true;
  }

  onInputChange(): void {
    this.isFormDirty = true;
  }

  handleCountryInputChange() {
    const countryId = this.countryFormControl.getRawValue()?.id;

    if (!countryId) {
      return;
    }

    this.staticData.GetCitiesByCountyId(countryId);
    this.cityFormControl.setValue('');
  }

  handleImageDeleteEvent(index: number) {
    if (this.userData == null || this.userData.photos.length === 0) {
      return;
    }

    this.imagesToDelete.push({
      PublicId: this.userData.photos[index].publicId,
      DbId: this.userData.photos[index].id,
    });
  }

  handleMainImageDeleteEvent(index: number) {
    if (this.userData == null || this.userData.photos.length === 0) {
      return;
    }

    this.imagesToDelete.push({
      PublicId: this.userData.photos[index].publicId,
      DbId: this.userData.photos[index].id,
    });
    this.hasUploadedMainImage = this.mainPhotoToUpload.length !== 0;
  }

  handleMainImageChangeEvent(image: File[]) {
    this.mainPhotoToUpload = image;
    this.hasUploadedMainImage = this.mainPhotoToUpload.length !== 0;
  }

  handleAdditionalImageChangeEvent(images: File[]) {
    this.additionalImagesToUpload = images;
  }

  submitUserUpdate() {
    this.userUpdateFormGroup.markAllAsTouched();

    const isFormValid = this.validateForm();
    console.log('isFormValid: ', isFormValid);
    if (!isFormValid) return;

    const user = this.userService.user();
    if (user == null) {
      return;
    }

    const updateUserDto: UpdateUserDto = this._transformUserUpdateFormData(
      this.userUpdateFormGroup.value
    );

    this.isFormDirty = false;

    const imagesToUpload = this._transformImagesToUpload();
    this.userService.submitUpdateUserData(
      updateUserDto,
      this.imagesToDelete,
      imagesToUpload
    );
  }

  validateForm(): boolean {
    if (this.userUpdateFormGroup.invalid) {
      this.toastr.error(
        'Please fill in all required inputs to proceed',
        'Missing fields'
      );
      return false;
    }

    if (!this.hasUploadedMainImage) {
      this.toastr.error(
        'Please upload main image to proceed',
        'Main image missing'
      );
      return false;
    }

    return true;
  }

  private _transformUserUpdateFormData(
    formValue: UserUpdateFormValues
  ): UpdateUserDto {
    return {
      ...formValue,
      country: formValue.country.name,
      dateOfBirth: formatToDateOnly(formValue.dateOfBirth),
    };
  }

  private _transformImagesToUpload(): PhotoToUpload[] {
    let imagesToUpload: PhotoToUpload[] = [];

    if (this.mainPhotoToUpload.length > 0) {
      imagesToUpload.push({
        photoFile: this.mainPhotoToUpload[0],
        isMain: true,
      });
    }

    if (this.additionalImagesToUpload.length > 0) {
      for (let i = 0; i < this.additionalImagesToUpload.length; i++) {
        imagesToUpload.push({
          photoFile: this.additionalImagesToUpload[i],
          isMain: false,
        });
      }
    }

    return imagesToUpload;
  }

  private _initUserData() {
    const username = this.authService.currentUser()?.username;
    if (!username) {
      return;
    }
    this.userService.fetchUserByUsername(username);
  }

  private _initSelectedCountry(countryName: string) {
    const selectedCountry = this.Countries.find(
      (country) => country.name === countryName
    );

    if (selectedCountry) {
      this.countryFormControl.setValue(selectedCountry);
    }
  }

  private _initUserPhotos(photos: Photo[]) {
    const additionalPhotos = photos
      .filter((photo) => !photo.isMain)
      .map((photo) => photo.url);
    this.additionalImages.set(additionalPhotos);

    const mainPhoto = photos.find((photo) => photo.isMain);
    if (!mainPhoto) {
      this.hasUploadedMainImage = false;
      return;
    }

    this.hasUploadedMainImage = true;
    this.mainPhoto.set([mainPhoto.url]);
  }

  private _initFormGroups() {
    this.userUpdateFormGroup = this.formBuilder.group({
      knownAs: [
        '',
        [
          Validators.required,
          Validators.minLength(min_knownAs),
          Validators.maxLength(max_knownAs),
        ],
      ],
      gender: [
        '',
        [
          Validators.required,
          Validators.minLength(min_gender),
          Validators.maxLength(max_gender),
        ],
      ],
      introduction: [
        '',
        [
          Validators.required,
          Validators.minLength(min_introduction),
          Validators.maxLength(max_introduction),
        ],
      ],
      interests: [
        '',
        [
          Validators.required,
          Validators.minLength(min_interests),
          Validators.maxLength(max_interests),
        ],
      ],
      lookingFor: [
        '',
        [
          Validators.required,
          Validators.minLength(min_lookingFor),
          Validators.maxLength(max_lookingFor),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(min_city),
          Validators.maxLength(max_city),
        ],
      ],
      country: [
        '',
        [
          Validators.required,
          Validators.minLength(min_country),
          Validators.maxLength(max_country),
        ],
      ],
      dateOfBirth: ['', [Validators.required]],
    });
  }

  get isLoading() {
    return (
      this.staticData.isFetchingCountryData() ||
      this.userService.isUpdatingUser()
    );
  }

  get isUpdatingUser() {
    return this.userService.isUpdatingUser();
  }

  get isFetchingCities() {
    return this.staticData.isFetchingCityData();
  }

  get Countries() {
    return this.staticData.countries();
  }

  get Cities() {
    return this.staticData.cities();
  }

  get knownAsFormControl() {
    return this.userUpdateFormGroup.get('knownAs') as FormControl;
  }

  get genderFormControl() {
    return this.userUpdateFormGroup.get('gender') as FormControl;
  }

  get countryFormControl() {
    return this.userUpdateFormGroup.get('country') as FormControl;
  }

  get cityFormControl() {
    return this.userUpdateFormGroup.get('city') as FormControl;
  }

  get dateOfBirthFormControl() {
    return this.userUpdateFormGroup.get('dateOfBirth') as FormControl;
  }

  get descriptionFormControl() {
    return this.userUpdateFormGroup.get('introduction') as FormControl;
  }

  get lookingForFormControl() {
    return this.userUpdateFormGroup.get('lookingFor') as FormControl;
  }

  get interestsFormControl() {
    return this.userUpdateFormGroup.get('interests') as FormControl;
  }

  get disableCityInput() {
    return this.countryFormControl.invalid;
  }

  get enableCityFreeTextInput() {
    return (
      this.countryFormControl.valid &&
      !this.isFetchingCities &&
      this.Cities.length === 0
    );
  }

  get userData() {
    return this.userService.user();
  }
}
