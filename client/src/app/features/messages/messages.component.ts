import { Component, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationParams } from '../../shared/models/user-params';
import { MessageService } from '../../shared/services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MatPaginatorModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  container: string = 'Inbox';

  constructor(private _messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this._messageService.getMessages(this.paginationParams, this.container);
  }

  handlePageEvent(e: PageEvent) {
    this.paginationParams.pageSize = e.pageSize;
    this.paginationParams.pageNumber = e.pageIndex + 1;
    this.loadMessages();
  }

  get messages() {
    return this._messageService.paginatedMessagesResult()?.items;
  }

  get totalItems() {
    return this._messageService.paginatedMessagesResult()?.pagination
      ?.totalItems;
  }
}
