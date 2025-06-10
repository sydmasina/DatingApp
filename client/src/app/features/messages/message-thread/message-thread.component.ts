import { Location } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private _messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getMessageThread();
  }

  getMessageThread() {
    const username = this.route.snapshot.paramMap.get('username');

    if (!username) {
      this.location.back();
      return;
    }

    this._messageService.getMessageThread(username).subscribe({
      next: (response) => {
        this.messageThread.set(response);
      },
    });
  }

  get currentUser() {
    return this.authService.currentUser()?.username;
  }
}
