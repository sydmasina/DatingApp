import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { User } from './shared/models/user';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './shared/shared.module';
import { AccountService } from './shared/services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, MatProgressSpinnerModule, SharedModule],
})
export class AppComponent implements OnInit {
  title = 'DatingApp';
  users: User[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient, private accountService: AccountService){}

  ngOnInit() {
    this.getUsers();
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if(!userString) return;
    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  getUsers(){
    this.http.get('https://localhost:7159/api/Users').subscribe({
      next: (response) => (this.users = response as User[]),
      error: (error) => console.log(error),
      complete: () => {
        this.isLoading = false;
        console.log('Request has completed');
      },
    });
  }
}
