import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MessageEndpoint } from '../constants/api-enpoints/message';
import { MessageContainerType } from '../constants/message';
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

  constructor(private _httpClient: HttpClient) {}

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

  sendMessage(messageBody: SendMessageBody) {
    return this._httpClient.post<Message>(MessageEndpoint, messageBody);
  }

  deleteMessage(id: number) {
    return this._httpClient.delete(`${MessageEndpoint}/${id}`);
  }
}
