import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
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
    RouterLink,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  container: MessageContainerType = MessageContainerType.Inbox;
  messageContainerType = MessageContainerType;
  isOutbox: boolean = this.container === MessageContainerType.Outbox;

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

  onDeleteMessage(id: number, index: number) {
    this._messageService.deleteMessage(id).subscribe({
      next: () => {
        this._messageService.paginatedMessagesResult.update((prev) => {
          if (prev && prev.items) {
            prev.items.splice(index, 1);
            if (prev.items.length === 0) {
              this.paginationParams.pageNumber = 1;
              this.loadMessages();
            }
            return prev;
          }
          return prev;
        });
      },
    });
  }

  getRoute(message: Message) {
    if (this.container === MessageContainerType.Outbox)
      return `/messages/${message.recipientUsername}`;
    else return `/messages/${message.senderUsername}`;
  }

  getRedirectRoute(message: Message): string {
    const messageThreadUsername =
      this.container === MessageContainerType.Outbox
        ? message.recipientUsername
        : message.senderUsername;

    return '/members/' + messageThreadUsername + '/open-messages';
  }

  get messages() {
    return this._messageService.paginatedMessagesResult()?.items;
  }

  get totalItems() {
    return this._messageService.paginatedMessagesResult()?.pagination
      ?.totalItems;
  }
}
