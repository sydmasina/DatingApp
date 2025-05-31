import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormRangeSelectorComponent } from '../../../shared/components/form-fields/form-range-selector/form-range-selector.component';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
import { FormInputFieldComponent } from '../../../shared/components/form-fields/form-text-input-field/form-input-field.component';
import { UserParams } from '../../../shared/models/user-params';
import { AuthService } from '../../../shared/services/auth.service';
import { StaticDataService } from '../../../shared/services/static-data.service';
import { UserService } from '../../../shared/services/user.service';
import { MemberCardComponent } from './member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    CommonModule,
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
  genderFormControl: FormControl = new FormControl('all');
  minAgeFormControl: FormControl = new FormControl(18);
  maxAgeFormControl: FormControl = new FormControl(30);
  countryFormControl: FormControl = new FormControl('');
  cityFormControl: FormControl = new FormControl('');
  userParams = new UserParams();

  constructor(
    private _userService: UserService,
    private staticData: StaticDataService,
    private _authService: AuthService
  ) {
    effect(() => {
      const pagination = this._userService.paginatedUsers()?.pagination;
      if (pagination) {
        this.pageSize = pagination.itemsPerPage;
      }
    });
  }

  ngOnInit(): void {
    if (!this._userService.paginatedUsers()) {
      this._loadUsers();
    }
    this.staticData.GetCountries();
    // this._initSelectedCountry();
  }

  // private _initSelectedCountry() {
  //   const countryName = this._authService.currentUser()
  //   const selectedCountry = this.Countries.find(
  //     (country) => country.name === countryName
  //   );

  //   if (selectedCountry) {
  //     this.countryFormControl.setValue(selectedCountry);
  //   }
  // }

  private _loadUsers() {
    this.userParams.gender = this.selectedGender;
    this.userParams.pageNumber = this.pageNumber;
    this.userParams.pageSize = this.pageSize;
    this.userParams.minAge = this.minAgeFormControl.value;
    this.userParams.maxAge = this.maxAgeFormControl.value;
    this.userParams.country = this.countryFormControl.value.name ?? '';
    this.userParams.city =
      this.cityFormControl.value.name ?? this.cityFormControl.value ?? '';
    this._userService.fetchUsers(this.userParams);
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageNumber = e.pageIndex + 1;
    this._loadUsers();
  }

  handlePreferredGenderSelectEvent() {
    this.pageNumber = 1;
    this._loadUsers();
  }

  handleAgeRangeChangeEvent() {
    this.pageNumber = 1;
    this._loadUsers();
  }

  handleCountryInputChange() {
    this.pageNumber = 1;
    this._loadUsers();

    const countryId = this.countryFormControl.getRawValue()?.id;
    if (!countryId) {
      return;
    }
    this.staticData.GetCitiesByCountyId(countryId);
    this.cityFormControl.setValue('');
  }

  get selectedGender() {
    return this.genderFormControl.value;
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

  get enableCityFreeTextInput() {
    return (
      this.countryFormControl.valid &&
      !this.isFetchingCities &&
      this.Cities.length === 0
    );
  }
}
