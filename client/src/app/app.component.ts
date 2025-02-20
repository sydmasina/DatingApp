import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { User } from './shared/models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule]
})
export class AppComponent implements OnInit{
  http = inject(HttpClient)
  title = 'DatingApp';
  users: User[] = [];
  isLoading: boolean = true;

  async ngOnInit() {
    await this.http.get('https://localhost:7159/api/Users').subscribe({
      next: response => this.users = response as User[],
      error: error=> console.log(error),
      complete: ()=>{ this.isLoading = false; console.log("Request has completed")}
    })
  }
}
