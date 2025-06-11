import { Component, input, OnInit, signal } from '@angular/core';
import { Message } from '../../../shared/models/message';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.css',
})
export class MessageThreadComponent implements OnInit {
  public readonly messageThread = signal<Message[]>([]);
  username = input.required<string>();

  constructor(
    private _messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getMessageThread();
  }

  getMessageThread() {
    this._messageService.getMessageThread(this.username()).subscribe({
      next: (response) => {
        this.messageThread.set(response);
      },
    });
  }

  get currentUser() {
    return this.authService.currentUser()?.username;
  }
}
