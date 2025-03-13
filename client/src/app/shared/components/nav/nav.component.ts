import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastrService: ToastrService
  ) {}
  loginModel: Login = {
    username: '',
    password: '',
  };

  login() {
    if (this.loginModel.username === '' || this.loginModel.password === '') {
      this.toastrService.error('Password and username is required!', 'Invalid input',{
        positionClass: 'toast-top-left',
        closeButton: true,
        
      });
      return;
    }

    this.accountService.login(this.loginModel).subscribe({
      next: () => {},
      error: (error) => console.log(error),
      complete: () => this.router.navigateByUrl('/members'),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
