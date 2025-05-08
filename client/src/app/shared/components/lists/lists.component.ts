import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../services/user.service';
import { ListCardComponent } from './list-card/list-card.component';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, ListCardComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit {
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this._userService.fetchUsers();
  }

  get users() {
    return this._userService.users();
  }
  get isLoading() {
    return this._userService.isFetchingUserData();
  }
}
