import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MessageContainerType } from '../../shared/constants/message';
import { Message } from '../../shared/models/message';
import { PaginationParams } from '../../shared/models/user-params';
import { MessageService } from '../../shared/services/message.service';
import { TimeAgoPipe } from '../../shared/utils/time-ago.pipe';
import { MessageThreadComponent } from './message-thread/message-thread.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    MatPaginatorModule,
    ButtonsModule,
    FormsModule,
    TimeAgoPipe,
    MatSidenavModule,
    MatButtonModule,
    MessageThreadComponent,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  paginationParams: PaginationParams = { pageNumber: 1, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 25, 50];
  container: MessageContainerType = MessageContainerType.Inbox;
  messageContainerType = MessageContainerType;
  messageThreadUsername: string | null = null;

  constructor(
    private _messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this._messageService.getMessages(this.paginationParams, this.container);

    const username = this.route.snapshot.paramMap.get('username');
    if (this.drawer && username) {
      this.messageThreadUsername = username;
      this.drawer.open();
      return;
    }

    if (this.drawer && this.drawer.opened) {
      this.drawer.close();
    }
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

  sentMessageThreadUsername(message: Message) {
    this.messageThreadUsername =
      this.container === MessageContainerType.Outbox
        ? message.recipientUsername
        : message.senderUsername;
  }

  handleDrawerClosed() {
    this.messageThreadUsername = null;
  }

  get messages() {
    return this._messageService.paginatedMessagesResult()?.items;
  }

  get totalItems() {
    return this._messageService.paginatedMessagesResult()?.pagination
      ?.totalItems;
  }
}
