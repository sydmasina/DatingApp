import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { RegisterComponent } from '../../../features/register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RegisterComponent,
    CommonModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  registerMode: boolean = false;

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  onCancelRegister(event: boolean) {
    this.registerMode = event;
  }
}
