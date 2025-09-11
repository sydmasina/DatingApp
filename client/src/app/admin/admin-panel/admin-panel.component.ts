import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { HasRoleDirective } from '../../shared/_directives/has-role.directive';
import { PhotoManagementComponent } from '../photo-management/photo-management.component';
import { UserManagementComponent } from '../user-management/user-management.component';
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    MatTabsModule,
    UserManagementComponent,
    HasRoleDirective,
    PhotoManagementComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {}
