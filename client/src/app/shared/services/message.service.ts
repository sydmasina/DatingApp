import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import { MessageEndpoint } from '../constants/api-enpoints/message';
import { Message } from '../models/message';
import { PaginatedResult } from '../models/pagination';
import { PaginationParams } from '../models/user-params';
import { setPaginatedResult, setPaginationParams } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly _paginatedMessagesResult = signal<PaginatedResult<
    Message[]
  > | null>(null);
  public readonly paginatedMessagesResult: Signal<PaginatedResult<
    Message[]
  > | null> = this._paginatedMessagesResult.asReadonly();

  constructor(private _httpClient: HttpClient) {}

  getMessages(paginationParams: PaginationParams, container: string) {
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
          setPaginatedResult(response, this._paginatedMessagesResult);
        },
      });
  }
}
