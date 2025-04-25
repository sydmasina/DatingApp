import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css',
})
export class ListsComponent implements OnInit, OnDestroy {
  usersSubscription!: Subscription;
  users: User[] = [];

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this._userService.fetchUsers();
    this._initSubscriptions();
  }

  ngOnDestroy(): void {
    this._unSubscribeToAllSubscriptions();
  }

  private _initSubscriptions() {
    this.usersSubscription = this._userService.users$.subscribe((users) => {
      this.users = users;
    });
  }

  private _unSubscribeToAllSubscriptions() {
    if (this.usersSubscription != null) {
      this.usersSubscription.unsubscribe();
    }
  }

  get isLoading() {
    return this._userService.isRunningFetchData;
  }
}
