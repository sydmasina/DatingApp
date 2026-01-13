import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoggedInUser } from '../models/login';
import { NewMessageNotification } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  private toastr = inject(ToastrService);
  private router = inject(Router);
  onlineUsers = signal<string[]>([]);

  createHubConnection(user: LoggedInUser) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      if (!environment.production) {
        console.log(error);
      }
    });

    this.hubConnection.on('GetOnlineUsers', (onlineUsers) => {
      if (onlineUsers == null) return;

      this.onlineUsers.set(onlineUsers);
    });

    this.hubConnection.on(
      'NewMessageReceived',
      (notification: NewMessageNotification) => {
        if (notification == null) return;

        this.toastr
          .info(
            notification.knownAs +
              ' has sent you a new message. Click to view it'
          )
          .onTap.pipe(take(1))
          .subscribe(() =>
            this.router.navigateByUrl(
              '/members/' + notification.username + '/open-messages'
            )
          );
      }
    );
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => {
        if (!environment.production) {
          console.log(error);
        }
      });
    }
  }
}
