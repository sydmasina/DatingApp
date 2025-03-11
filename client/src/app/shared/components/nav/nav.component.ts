import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav.component.html',
})
export class NavComponent {
  constructor(public accountService: AccountService) {}
  loginModel: Login = {
    username: '',
    password: '',
  };

  login() {
    if (this.loginModel.username === '' || this.loginModel.password === '') {
      console.log('Username and password are required');
      return;
    }

    this.accountService.login(this.loginModel).subscribe({
      next: () => {},
      error: (error) => console.log(error),
    });
  }

  logout() {
    this.accountService.logout();
  }
}
