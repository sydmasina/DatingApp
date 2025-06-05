import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LikesService } from '../../../shared/services/likes.service';
import { MemberCardComponent } from '../../members/member-list/member-card/member-card.component';

@Component({
  selector: 'app-liked-by-me-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './liked-by-me-list.component.html',
  styleUrl: './liked-by-me-list.component.css',
})
export class LikedByMeListComponent implements OnInit {
  constructor(private _likesService: LikesService) {}

  ngOnInit(): void {
    this._likesService.getLikedByMe();
  }

  get likedByMe() {
    return this._likesService.likedByMe();
  }
}
