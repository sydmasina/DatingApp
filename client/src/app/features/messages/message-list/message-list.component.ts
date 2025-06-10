import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MessageContainerType } from '../../../shared/constants/message';
import { Message } from '../../../shared/models/message';
import { PaginationParams } from '../../../shared/models/user-params';
import { MessageService } from '../../../shared/services/message.service';
import { TimeAgoPipe } from '../../../shared/utils/time-ago.pipe';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    MatPaginatorModule,
    ButtonsModule,
    FormsModule,
    TimeAgoPipe,
    RouterLink,
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent implements OnInit {
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  container: MessageContainerType = MessageContainerType.Inbox;
  messageContainerType = MessageContainerType;

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

  getRoute(message: Message) {
    if (this.container === MessageContainerType.Outbox)
      return `/messages/${message.recipientUsername}`;
    else return `/messages/${message.senderUsername}`;
  }

  get messages() {
    return this._messageService.paginatedMessagesResult()?.items;
  }

  get totalItems() {
    return this._messageService.paginatedMessagesResult()?.pagination
      ?.totalItems;
  }
}
