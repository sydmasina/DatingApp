import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LikesService } from '../../../shared/services/likes.service';
import { MemberCardComponent } from '../../members/member-list/member-card/member-card.component';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.css',
})
export class MatchListComponent implements OnInit {
  constructor(private _likesService: LikesService) {}

  ngOnInit(): void {
    this._likesService.getMatches();
  }

  get matches() {
    return this._likesService.matches();
  }
}
