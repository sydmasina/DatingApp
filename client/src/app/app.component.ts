import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { RegisterModule } from './features/register/register.module';
import { AuthService } from './shared/services/auth.service';
import { SharedModule } from './shared/shared.module';

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
    RouterOutlet,
    NgxSpinnerComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'DatingApp';
  isLoading: boolean = true;

  constructor(private _authService: AuthService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    this._authService.currentUser.set(user);
  }
}
