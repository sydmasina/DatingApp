import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  loginModel!: Login;

  login(){
    console.log(this.loginModel);
  }
}
