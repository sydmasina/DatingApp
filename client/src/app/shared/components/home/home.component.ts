import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegisterComponent } from '../../../features/register/register.component';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent, CommonModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  registerMode: boolean = false;
  users: User[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  onCancelRegister(event: boolean) {
    this.registerMode = event;
  }

  getUsers() {
    this.http.get('https://localhost:7159/api/Users').subscribe({
      next: (response) => (this.users = response as User[]),
      error: (error) => console.log(error),
      complete: () => {
        console.log('Request has completed');
        this.isLoading = false;
      },
    });
  }
}
