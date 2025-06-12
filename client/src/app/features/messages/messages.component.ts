import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MessageContainerType } from '../../shared/constants/message';
import { Message } from '../../shared/models/message';
import { PaginationParams } from '../../shared/models/user-params';
import { MessageService } from '../../shared/services/message.service';
import { TimeAgoPipe } from '../../shared/utils/time-ago.pipe';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    MatPaginatorModule,
    ButtonsModule,
    FormsModule,
    TimeAgoPipe,
    MatButtonModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  container: MessageContainerType = MessageContainerType.Inbox;
  messageContainerType = MessageContainerType;

  constructor(
    private _messageService: MessageService,
    private router: Router
  ) {}

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

  redirectToMessageThread(message: Message) {
    const messageThreadUsername =
      this.container === MessageContainerType.Outbox
        ? message.recipientUsername
        : message.senderUsername;

    this.router.navigate([
      '/members/' + messageThreadUsername + '/open-messages',
    ]);
  }

  get messages() {
    return this._messageService.paginatedMessagesResult()?.items;
  }

  get totalItems() {
    return this._messageService.paginatedMessagesResult()?.pagination
      ?.totalItems;
  }
}
