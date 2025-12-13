import { TitleCasePipe } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SendMessageBody } from '../../../../shared/models/message';
import { AuthService } from '../../../../shared/services/auth.service';
import { MessageService } from '../../../../shared/services/message.service';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [TitleCasePipe, FormsModule, ReactiveFormsModule],
  templateUrl: './message-thread.component.html',
  styleUrl: './message-thread.component.css',
})
export class MessageThreadComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  private authService = inject(AuthService);
  public messageService = inject(MessageService);
  private _router = inject(Router);
  @ViewChild('threadBodyu') private threadBody!: ElementRef;

  username = input.required<string>();
  recipientPhotoUrl = input.required<string>();
  closeMessageThread = output();
  newMessageControl = new FormControl('');

  ngOnInit(): void {
    this.getMessageThread();
    this.scrollThreadToBottom();
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  ngAfterViewChecked(): void {
    this.scrollThreadToBottom();
  }

  scrollThreadToBottom(): void {
    try {
      this.threadBody.nativeElement.scrollTop =
        this.threadBody.nativeElement.scrollHeight;
    } catch (err) {}
  }

  getMessageThread() {
    const currentUserUser = this.authService.currentUser();
    if (!currentUserUser) return;
    this.messageService.createHubConnection(currentUserUser, this.username());
  }

  onOpenProfile() {
    this._router.navigate(['./members/' + this.username()]);
  }

  onCloseMessageThread() {
    this.messageService.stopHubConnection();
    this.closeMessageThread.emit();
  }

  sendMessage() {
    if (this.newMessageControl.value === '') {
      return;
    }

    const messagePayload: SendMessageBody = {
      recipientUsername: this.username(),
      content: this.newMessageControl.value ?? '',
    };

    this.messageService.sendMessage(messagePayload);

    this.newMessageControl.setValue('');
  }

  get currentUser() {
    return this.authService.currentUser()?.username;
  }
}
