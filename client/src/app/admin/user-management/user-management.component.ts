import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { AdminService } from '../../shared/services/admin.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  users: User[] = [];

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: (users) => (this.users = users),
    });
  }
}
