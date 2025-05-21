import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../shared/services/user.service';
import { MemberCardComponent } from './member-card/member-card.component';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MemberCardComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css',
})
export class MemberListComponent {
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    if (this._userService.users().length === 0) {
      this._userService.fetchUsers();
    }
  }

  get users() {
    return this._userService.users();
  }

  get isLoading() {
    return this._userService.isFetchingUserData();
  }
}
