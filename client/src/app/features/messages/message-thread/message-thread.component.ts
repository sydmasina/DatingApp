import { TitleCasePipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from '../../../shared/models/message';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.css',
})
export class MessageThreadComponent implements OnInit {
  public readonly messageThread = signal<Message[]>([]);
  username = input.required<string>();

  constructor(
    private _messageService: MessageService,
    private authService: AuthService,
    private _router: Router
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

  onOpenProfile(username: string) {
    this._router.navigate(['./members/' + username]);
  }

  get currentUser() {
    return this.authService.currentUser()?.username;
  }
}
