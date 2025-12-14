import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { MessageEndpoint } from '../constants/api-enpoints/message';
import { MessageContainerType } from '../constants/message';
import { LoggedInUser } from '../models/login';
import { Message, SendMessageBody } from '../models/message';
import { PaginatedResult } from '../models/pagination';
import { PaginationParams } from '../models/user-params';
import { setPaginatedResult, setPaginationParams } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  public readonly paginatedMessagesResult = signal<PaginatedResult<
    Message[]
  > | null>(null);
  hubUrl = environment.hubsUrl;
  private hubConnection?: HubConnection;
  messageThread = signal<Message[]>([]);

  constructor(private _httpClient: HttpClient) {}

  createHubConnection(user: LoggedInUser, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => {
      if (!environment.production) {
        console.log(error);
      }
    });

    this.hubConnection.on('ReceiveMessageThread', (messages) =>
      this.messageThread.set(messages)
    );

    this.hubConnection.on('NewMessage', (message) =>
      this.messageThread.update((messageThread) => [...messageThread, message])
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

  getMessages(
    paginationParams: PaginationParams,
    container: MessageContainerType
  ) {
    var params = new HttpParams();
    params = params.append('container', container);
    params = setPaginationParams(params, paginationParams);

    this._httpClient
      .get<Message[]>(MessageEndpoint, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          setPaginatedResult(response, this.paginatedMessagesResult);
        },
      });
  }

  getMessageThread(username: string) {
    return this._httpClient.get<Message[]>(
      MessageEndpoint + '/thread/' + username
    );
  }

  async sendMessage(messageBody: SendMessageBody) {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.invoke('SendMessage', messageBody);
    }
  }

  deleteMessage(id: number) {
    return this._httpClient.delete(`${MessageEndpoint}/${id}`);
  }
}
