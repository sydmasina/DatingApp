import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PredicateTypes } from '../../../shared/constants/pagination';
import { PaginationParams } from '../../../shared/models/user-params';
import { LikesService } from '../../../shared/services/likes.service';
import { MemberCardComponent } from '../../members/member-list/member-card/member-card.component';

@Component({
  selector: 'app-liked-by-list',
  standalone: true,
  imports: [CommonModule, MemberCardComponent, MatPaginatorModule],
  templateUrl: './liked-by-list.component.html',
  styleUrl: './liked-by-list.component.css',
})
export class LikedByListComponent implements OnInit {
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  constructor(private _likesService: LikesService) {}

  ngOnInit(): void {
    this._likesService.getLikes(PredicateTypes.likedBy, this.paginationParams);
  }

  handlePageEvent(e: PageEvent) {
    this.paginationParams.pageSize = e.pageSize;
    this.paginationParams.pageNumber = e.pageIndex + 1;
    this._likesService.getLikes(PredicateTypes.likedBy, this.paginationParams);
  }

  get LikedBy() {
    return this._likesService.likedBy()?.items;
  }

  get totalItems() {
    return this._likesService.likedBy()?.pagination?.totalItems;
  }
}
