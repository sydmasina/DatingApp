import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PredicateTypes } from '../../../shared/constants/pagination';
import { PaginationParams } from '../../../shared/models/user-params';
import { LikesService } from '../../../shared/services/likes.service';
import { MemberCardComponent } from '../../members/member-list/member-card/member-card.component';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [MemberCardComponent, MatPaginatorModule],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.css',
})
export class MatchListComponent implements OnInit {
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  constructor(private _likesService: LikesService) {}

  ngOnInit(): void {
    this._likesService.getLikes(PredicateTypes.matches, this.paginationParams);
  }

  handlePageEvent(e: PageEvent) {
    this.paginationParams.pageSize = e.pageSize;
    this.paginationParams.pageNumber = e.pageIndex + 1;
    this._likesService.getLikes(PredicateTypes.matches, this.paginationParams);
  }

  get matches() {
    return this._likesService.matches()?.items;
  }

  get totalItems() {
    return this._likesService.matches()?.pagination?.totalItems;
  }
}
