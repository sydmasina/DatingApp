import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormRangeSelectorComponent } from '../../../shared/components/form-fields/form-range-selector/form-range-selector.component';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
import { FormInputFieldComponent } from '../../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { StaticDataService } from '../../../shared/services/static-data.service';
import { UserService } from '../../../shared/services/user.service';
import { MemberCardComponent } from './member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MemberCardComponent,
    FormSelectFieldComponent,
    FormRangeSelectorComponent,
    FormInputFieldComponent,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent {
  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  GenderOptions: string[] = ['all', 'male', 'female'];
  SortByOptions: string[] = ['created', 'lastActive'];
  filterFormGroup!: FormGroup;

  constructor(
    private _userService: UserService,
    private staticData: StaticDataService,
    private fb: FormBuilder
  ) {
    effect(() => {
      const pagination = this._userService.paginatedUsers()?.pagination;
      if (pagination) {
        this.pageSize = pagination.itemsPerPage;
      }
    });
  }

  ngOnInit(): void {
    this._initFormGroup();
    if (!this._userService.paginatedUsers()) {
      this._filterUsers();
    }

    if (this.staticData.countries().length === 0) {
      this.staticData.GetCountries();
    }
  }

  private _initFormGroup() {
    this.filterFormGroup = this.fb.group({
      gender: [this._userService.userParams().gender],
      minAge: [this._userService.userParams().minAge],
      maxAge: [this._userService.userParams().maxAge],
      country: [this._userService.userParams().country],
      city: [this._userService.userParams().city],
      sortBy: [this._userService.userParams().orderBy],
    });
  }

  private _filterUsers() {
    this._userService.userParams().gender = this.genderFormControl.value;
    this._userService.userParams().pageNumber = this.pageNumber;
    this._userService.userParams().pageSize = this.pageSize;
    this._userService.userParams().minAge = this.minAgeFormControl.value;
    this._userService.userParams().maxAge = this.maxAgeFormControl.value;
    this._userService.userParams().country =
      this.countryFormControl.value.name ?? '';
    this._userService.userParams().city =
      this.cityFormControl.value.name ?? this.cityFormControl.value ?? '';
    this._userService.userParams().orderBy = this.sortByFormControl.value ?? '';
    this._userService.fetchUsers();
  }

  submitFilters() {
    this.pageNumber = 1;
    this._filterUsers();
  }

  resetFilters() {
    if (this.filterFormGroup.dirty) {
      this._initFormGroup();
      this._filterUsers();
    }
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
    this._filterUsers();
  }

  handleCountryInputChange() {
    const countryId = this.countryFormControl.getRawValue()?.id;
    if (!countryId) {
      return;
    }
    this.staticData.GetCitiesByCountyId(countryId);
    this.cityFormControl.setValue('');
  }

  get genderFormControl() {
    return this.filterFormGroup.get('gender') as FormControl;
  }

  get minAgeFormControl() {
    return this.filterFormGroup.get('minAge') as FormControl;
  }

  get maxAgeFormControl() {
    return this.filterFormGroup.get('maxAge') as FormControl;
  }

  get countryFormControl() {
    return this.filterFormGroup.get('country') as FormControl;
  }

  get cityFormControl() {
    return this.filterFormGroup.get('city') as FormControl;
  }

  get sortByFormControl() {
    return this.filterFormGroup.get('sortBy') as FormControl;
  }

  get users() {
    return this._userService.paginatedUsers()?.items;
  }

  get pagination() {
    return this._userService.paginatedUsers()?.pagination;
  }

  get isLoading() {
    return this._userService.isFetchingUserData();
  }

  get Countries() {
    return this.staticData.countries();
  }

  get Cities() {
    return this.staticData.cities();
  }
  get isFetchingCities() {
    return this.staticData.isFetchingCityData();
  }

  get currentPage() {
    return this._userService.paginatedUsers()?.pagination?.currentPage ?? 1;
  }

  get itemsPerPage() {
    return this._userService.paginatedUsers()?.pagination?.itemsPerPage ?? 5;
  }

  get totalItems() {
    return this._userService.paginatedUsers()?.pagination?.totalItems ?? 5;
  }

  get enableCityFreeTextInput() {
    return (
      this.countryFormControl.valid &&
      !this.isFetchingCities &&
      this.Cities.length === 0
    );
  }
}
