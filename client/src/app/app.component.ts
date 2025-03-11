import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './shared/shared.module';
import { AccountService } from './shared/services/account.service';
import { RegisterModule } from './features/register/register.module';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    SharedModule,
    RegisterModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'DatingApp';
  isLoading: boolean = true;

  constructor(
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

}
