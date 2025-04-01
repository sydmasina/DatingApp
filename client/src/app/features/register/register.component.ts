import { Component, input, output } from '@angular/core';
import { Register } from '../../shared/models/register';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../shared/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  cancelRegister = output<boolean>();
  registerModel: Register = {
    username: '',
    password: '',
  };

  constructor(
    private accountService: AccountService,
    private toastrService: ToastrService
  ) {}

  register() {
    if (this.registerModel.username === '' || this.registerModel.password === '') {
      this.toastrService.error('Password and username is required!', 'Invalid input');
      return;
    }

    this.accountService.register(this.registerModel).subscribe({
      next: (response) => {
        this.cancel();
      },
      error: (error) => {
        this.toastrService.error(
          'An unexpected error occurred while submitting request',
          'Request failed',
          {
            positionClass: 'toast-bottom-left',
            closeButton: true,
          }
        );
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
