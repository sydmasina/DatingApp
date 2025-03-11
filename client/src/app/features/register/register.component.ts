import { Component, input, output} from '@angular/core';
import { Register } from '../../shared/models/register';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../shared/services/account.service';

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
    password: ''
  };

  constructor(private accountService: AccountService){}

  register() {
    this.accountService.register(this.registerModel).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
