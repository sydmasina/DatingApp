import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ToastrService } from 'ngx-toastr';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { Login } from '../../models/login';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe,
    HasRoleDirective,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) {}
  loginModel: Login = {
    username: '',
    password: '',
  };
  adminRoles: string[] = ['Admin', 'Moderator'];

  login() {
    if (this.loginModel.username === '' || this.loginModel.password === '') {
      this.showToastr('Password and username is required!', 'Invalid input');
      return;
    }

    this.authService.login(this.loginModel).subscribe({
      next: () => {},
      error: (error) => {},
      complete: () => this.router.navigateByUrl('/members'),
    });
  }

  showToastr(message: string, heading: string) {
    this.toastrService.error(message, heading, {
      positionClass: 'toast-top-right',
      closeButton: true,
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  get loggedInUser() {
    return this.authService.currentUser();
  }
}
