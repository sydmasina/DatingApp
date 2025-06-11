import { TitleCasePipe } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, SendMessageBody } from '../../../shared/models/message';
import { AuthService } from '../../../shared/services/auth.service';
import { MessageService } from '../../../shared/services/message.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [TitleCasePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.css',
})
export class MessageThreadComponent implements OnInit {
  public readonly messageThread = signal<Message[]>([]);
  username = input.required<string>();
  userPhotoUrl = input.required<string>();
  newMessageControl = new FormControl('');

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

  onOpenProfile() {
    this._router.navigate(['./members/' + this.username()]);
  }

  sendMessage() {
    if (this.newMessageControl.value === '') {
      return;
    }

    const messagePayload: SendMessageBody = {
      recipientUsername: this.username(),
      content: this.newMessageControl.value ?? '',
    };

    this._messageService.sendMessage(messagePayload).subscribe({
      next: (response) => {
        this.messageThread.update((messageThread) => [
          ...messageThread,
          response,
        ]);
      },
    });

    this.newMessageControl.setValue('');
  }

  get currentUser() {
    return this.authService.currentUser()?.username;
  }
}
