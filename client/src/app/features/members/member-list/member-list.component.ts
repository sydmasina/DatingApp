import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormSelectFieldComponent } from '../../../shared/components/form-fields/form-select-field/form-select-field.component';
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
    this._userService.fetchUsers(
      this.pageNumber,
      this.pageSize,
      this.selectedGender
    );
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
