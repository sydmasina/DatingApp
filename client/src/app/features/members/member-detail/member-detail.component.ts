import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatDrawer,
  MatDrawerMode,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { DrawerMobileBreakPoint } from '../../../shared/constants/mat-drawer';
import { PresenceService } from '../../../shared/services/presence.service';
import { UserService } from '../../../shared/services/user.service';
import { MessageThreadComponent } from './message-thread/message-thread.component';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MessageThreadComponent,
  ],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private userService = inject(UserService);
  private breakpointObserver = inject(BreakpointObserver);
  presenceService = inject(PresenceService);
  @ViewChild('drawer') drawer!: MatDrawer;
  openMessages: boolean = false;
  drawerMode: MatDrawerMode = 'side';
  CUSTOM_BREAKPOINT = '(min-width: 991px)';

  ngOnInit(): void {
    this.initUserDetails();
    this.setDrawerModeOnDifferentScreenSizes();
  }

  initUserDetails() {
    const username = this.route.snapshot.paramMap.get('username');
    const openMessages = this.route.snapshot.paramMap.get('openMessages');

    if (!username) {
      this.location.back();
      return;
    }

    if (openMessages) {
      this.openMessages = true;
    }

    this.userService.fetchUserByUsername(username);
  }

  handleCloseMessageThreadEvent() {
    if (this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
  }

  setDrawerModeOnDifferentScreenSizes() {
    this.breakpointObserver
      .observe([DrawerMobileBreakPoint])
      .subscribe((result) => {
        if (result.breakpoints[DrawerMobileBreakPoint]) {
          this.drawerMode = 'over';
        } else {
          this.drawerMode = 'side';
        }
      });
  }

  get user() {
    return this.userService.user();
  }

  get isLoading() {
    return this.userService.isFetchingUserData();
  }

  get isOnline() {
    return this.presenceService
      .onlineUsers()
      .includes(this.user?.userName ?? '');
  }
}
