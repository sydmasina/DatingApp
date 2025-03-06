import { Component } from '@angular/core';
import { Register } from '../../shared/models/register';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerModel: Register = {
    username: '',
    password: ''
  };

  register() {
    console.log('Registering...', this.registerModel);
  }

  cancel() {
    console.log('cancelled');
  }
}
