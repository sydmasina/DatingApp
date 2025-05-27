import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, output, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CanComponentDeactivate } from '../../shared/_guards/unsaved-changes.guard';
import { FormDateFieldComponent } from '../../shared/components/form-fields/form-date-field/form-date-field.component';
import { FormSelectFieldComponent } from '../../shared/components/form-fields/form-select-field/form-select-field.component';
import { FormInputFieldComponent } from '../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { ImageGalleryComponent } from '../../shared/components/form-fields/image-gallery/image-gallery.component';
import {
  max_city,
  max_country,
  max_dateOfBirth,
  max_gender,
  max_interests,
  max_introduction,
  max_knownAs,
  max_lookingFor,
  max_username,
  min_city,
  min_country,
  min_dateOfBirth,
  min_gender,
  min_interests,
  min_introduction,
  min_knownAs,
  min_lookingFor,
  min_username,
} from '../../shared/constants/user-form-constants';
import { PhotoToDelete, PhotoToUpload } from '../../shared/models/Photo';
import { RegisterDto, RegisterFormValues } from '../../shared/models/register';
import { AuthService } from '../../shared/services/auth.service';
import { StaticDataService } from '../../shared/services/static-data.service';
import { UserService } from '../../shared/services/user.service';
import { passwordMatchValidator } from '../../shared/utils/form-validator-functions';
import { formatToDateOnly } from '../../shared/utils/helpers';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormInputFieldComponent,
    FormSelectFieldComponent,
    FormDateFieldComponent,
    ImageGalleryComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, CanComponentDeactivate {
  cancelRegister = output<boolean>();
  registerFormGroup!: FormGroup;
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
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public staticData: StaticDataService,
    private toastr: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this._initFormGroup();
    this.staticData.GetCountries();
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

  handleMainImageChangeEvent(image: File[]) {
    this.mainPhotoToUpload = image;
    this.hasUploadedMainImage = this.mainPhotoToUpload.length !== 0;
  }

  handleAdditionalImageChangeEvent(images: File[]) {
    this.additionalImagesToUpload = images;
  }

  validateForm(): boolean {
    if (this.registerFormGroup.invalid) {
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

  register() {
    this.registerFormGroup.markAllAsTouched();

    const isFormValid = this.validateForm();

    if (!isFormValid) return;

    const registerDtoPayload: RegisterDto = this._transformRegisterFormData(
      this.registerFormGroup.value
    );
    const imagesToUpload = this._transformImagesToUpload();

    this.isFormDirty = false;
    this.authService.register(registerDtoPayload, imagesToUpload);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  private _initFormGroup() {
    this.registerFormGroup = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(min_username),
            Validators.maxLength(max_username),
          ],
        ],
        dateOfBirth: ['', [Validators.required]],
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
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(60),
          ],
        ],
        confirmPassword: ['', [Validators.required, passwordMatchValidator]],
      },
      { validators: passwordMatchValidator }
    );
  }

  private _transformRegisterFormData(
    formValue: RegisterFormValues
  ): RegisterDto {
    let city: string;
    if (typeof formValue.city === 'string') {
      city = formValue.city;
    } else {
      city = formValue.city.name;
    }

    return {
      ...formValue,
      country: formValue.country.name,
      city: city,
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

  get isLoading() {
    return this.staticData.isFetchingCountryData();
  }

  get usernameFormControl() {
    return this.registerFormGroup.get('username') as FormControl;
  }

  get passwordFormControl() {
    return this.registerFormGroup.get('password') as FormControl;
  }

  get confirmPasswordFormControl() {
    return this.registerFormGroup.get('confirmPassword') as FormControl;
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
    return this.registerFormGroup.get('knownAs') as FormControl;
  }

  get genderFormControl() {
    return this.registerFormGroup.get('gender') as FormControl;
  }

  get countryFormControl() {
    return this.registerFormGroup.get('country') as FormControl;
  }

  get cityFormControl() {
    return this.registerFormGroup.get('city') as FormControl;
  }

  get dateOfBirthFormControl() {
    return this.registerFormGroup.get('dateOfBirth') as FormControl;
  }

  get descriptionFormControl() {
    return this.registerFormGroup.get('introduction') as FormControl;
  }

  get lookingForFormControl() {
    return this.registerFormGroup.get('lookingFor') as FormControl;
  }

  get interestsFormControl() {
    return this.registerFormGroup.get('interests') as FormControl;
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
}
