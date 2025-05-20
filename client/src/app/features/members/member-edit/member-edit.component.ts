import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CanComponentDeactivate } from '../../../shared/_guards/unsaved-changes.guard';
import { FormDateFieldComponent } from '../../../shared/components/form-fields/form-date-field/form-date-field.component';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
import { FormInputFieldComponent } from '../../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { ImageGalleryComponent } from '../../../shared/components/form-fields/image-gallery/image-gallery.component';
import { Photo, PhotoToDelete } from '../../../shared/models/Photo';
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
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit, CanComponentDeactivate {
  userUpdateFormGroup!: FormGroup;
  GenderOptions: string[] = ['male', 'female'];
  userPhotos: string[] = [];
  imagesToDelete: PhotoToDelete[] = [];
  imagesToUpload: File[] = [];

  isFormDirty = false;

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
    private userService: UserService
  ) {
    effect(() => {
      const user = this.userService.user();
      if (user) {
        this.userUpdateFormGroup.patchValue(user);
        this._initSelectedCountry(user.country);
        this._initUserPhotos(user.photos);
      }
    });
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

  submitUserUpdate() {
    const user = this.userService.user();

    if (user == null) {
      return;
    }

    const updateUserDto: UpdateUserDto = this._transformUserUpdateFormData(
      this.userUpdateFormGroup.value
    );

    this.isFormDirty = false;

    this.userService.submitUpdateUserData(
      updateUserDto,
      this.imagesToDelete,
      this.imagesToUpload
    );
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
    this.userPhotos = photos.map((photo) => photo.url);
  }

  private _initFormGroups() {
    this.userUpdateFormGroup = this.formBuilder.group({
      knownAs: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      introduction: ['', [Validators.required]],
      interests: ['', [Validators.required]],
      lookingFor: ['', [Validators.required]],
    });
  }

  get isLoading() {
    return this.staticData.isFetchingCountryData();
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
