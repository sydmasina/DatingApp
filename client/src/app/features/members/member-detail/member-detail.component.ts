import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  username: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.initUserDetails();
  }

  initUserDetails() {
    this.username = this.route.snapshot.paramMap.get('username');

    if (this.username == null) {
      this.location.back();
    }

    this.userService.fetchUserByUsername(this.username);
  }

  get user() {
    return this.userService.user();
  }

  get isLoading() {
    return this.userService.isFetchingUserData();
  }
}
