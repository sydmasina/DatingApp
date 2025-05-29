import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormRangeSelectorComponent } from '../../../shared/components/form-fields/form-range-selector/form-range-selector.component';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
import { UserParams } from '../../../shared/models/user-params';
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
  userParams = new UserParams();

  constructor(private _userService: UserService) {
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
  }

  private _loadUsers() {
    this.userParams.gender = this.selectedGender;
    this.userParams.pageNumber = this.pageNumber;
    this.userParams.pageSize = this.pageSize;
    this.userParams.minAge = this.minAgeFormControl.value;
    this.userParams.maxAge = this.maxAgeFormControl.value;
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
}
