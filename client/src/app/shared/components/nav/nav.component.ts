import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../../models/login';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav.component.html'
})
export class NavComponent {
  constructor(private accountService: AccountService) {}
  loginModel: Login = {
    username: '',
    password: ''
  };

  async login(){
    if(this.loginModel.username === '' || this.loginModel.password === ''){
      console.log('Username and password are required');
      return;
    }

    var response = await this.accountService.login(this.loginModel);
    console.log(response);
  }
}
