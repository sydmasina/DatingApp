import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LikesService } from '../../../shared/services/likes.service';
import { MemberCardComponent } from '../../members/member-list/member-card/member-card.component';

@Component({
  selector: 'app-liked-by-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './liked-by-list.component.html',
  styleUrl: './liked-by-list.component.css',
})
export class LikedByListComponent implements OnInit {
  constructor(private _likesService: LikesService) {}

  ngOnInit(): void {
    this._likesService.getLikedBy();
  }

  get LikedBy() {
    return this._likesService.likedBy();
  }
}
