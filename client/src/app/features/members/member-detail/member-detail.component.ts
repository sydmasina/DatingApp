import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
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
  @ViewChild('drawer') drawer!: MatDrawer;
  openMessages: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUserDetails();
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

  get user() {
    return this.userService.user();
  }

  get isLoading() {
    return this.userService.isFetchingUserData();
  }
}
