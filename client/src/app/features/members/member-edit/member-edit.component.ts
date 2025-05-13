import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { StaticDataService } from '../../../shared/services/static-data.service';

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
  ],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css',
})
export class MemberEditComponent implements OnInit {
  memberEditFormGroup!: FormGroup;
  GenderOptions: string[] = ['Male', 'Female'];

  constructor(
    public staticData: StaticDataService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this._initFormGroups();
    this.staticData.GetCountries();
  }

  submitMemberEdit() {}

  private _initFormGroups() {
    this.memberEditFormGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      knownAs: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      country: ['', [Validators.required]],
      city: ['', [Validators.required]],
      description: ['', [Validators.required]],
      interests: ['', [Validators.required]],
      lookingFor: ['', [Validators.required]],
      photos: ['', [Validators.required]],
    });
  }

  get isLoading() {
    return this.staticData.isFetchingCountryData();
  }

  get Countries() {
    return this.staticData.countries();
  }

  get Cities() {
    return this.staticData.cities();
  }

  get userNameFormControl() {
    return this.memberEditFormGroup.get('username') as FormControl;
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
    return this.memberEditFormGroup.get('description') as FormControl;
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
}
