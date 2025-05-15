import { CommonModule } from '@angular/common';
import { Component, effect, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormDateFieldComponent } from '../../../shared/components/form-fields/form-date-field/form-date-field.component';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
import { FormInputFieldComponent } from '../../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { ImageGalleryComponent } from '../../../shared/components/form-fields/image-gallery/image-gallery.component';
import { Photo } from '../../../shared/models/Photo';
import { AuthService } from '../../../shared/services/auth.service';
import { StaticDataService } from '../../../shared/services/static-data.service';
import { UserService } from '../../../shared/services/user.service';

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
export class MemberEditComponent implements OnInit {
  memberEditFormGroup!: FormGroup;
  photosToUploadFormControl: FormControl = new FormControl({ photos: null });
  GenderOptions: string[] = ['male', 'female'];
  userPhotos: string[] = [];

  constructor(
    public staticData: StaticDataService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    effect(() => {
      const user = this.userService.loggedInUserData();
      if (user) {
        this.memberEditFormGroup.patchValue(user);
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

  submitMemberEdit() {}

  handleCountryInputChange() {
    const countryId = this.countryFormControl.getRawValue()?.id;

    if (!countryId) {
      return;
    }

    this.staticData.GetCitiesByCountyId(countryId);
    this.cityFormControl.setValue('');
  }

  private _initUserData() {
    const username = this.authService.currentUser()?.username;
    if (!username) {
      return;
    }
    this.userService.fetchCurrentUserData(username);
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
    this.memberEditFormGroup = this.formBuilder.group({
      userName: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      introduction: ['', [Validators.required]],
      interests: ['', [Validators.required]],
      lookingFor: ['', [Validators.required]],
      photos: ['', [Validators.required]],
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

  get userNameFormControl() {
    return this.memberEditFormGroup.get('userName') as FormControl;
  }

  get knownAsFormControl() {
    return this.memberEditFormGroup.get('knownAs') as FormControl;
  }

  get genderFormControl() {
    return this.memberEditFormGroup.get('gender') as FormControl;
  }

  get countryFormControl() {
    return this.memberEditFormGroup.get('country') as FormControl;
  }

  get cityFormControl() {
    return this.memberEditFormGroup.get('city') as FormControl;
  }

  get dateOfBirthFormControl() {
    return this.memberEditFormGroup.get('dateOfBirth') as FormControl;
  }

  get descriptionFormControl() {
    return this.memberEditFormGroup.get('introduction') as FormControl;
  }

  get lookingForFormControl() {
    return this.memberEditFormGroup.get('lookingFor') as FormControl;
  }

  get photosFormControl() {
    return this.memberEditFormGroup.get('photos') as FormControl;
  }

  get interestsFormControl() {
    return this.memberEditFormGroup.get('interests') as FormControl;
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
    return this.userService.loggedInUserData();
  }
}
