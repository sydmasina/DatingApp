import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { LikesEndpoint } from '../constants/api-enpoints/likes';
import { PredicateTypes } from '../constants/pagination';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { PaginationParams } from '../models/user-params';
import { setPaginatedResult, setPaginationParams } from '../utils/helpers';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private readonly _matches = signal<PaginatedResult<User[]> | null>(null);
  public readonly matches: Signal<PaginatedResult<User[]> | null> =
    this._matches.asReadonly();

  private readonly _likedBy = signal<PaginatedResult<User[]> | null>(null);
  public readonly likedBy: Signal<PaginatedResult<User[]> | null> =
    this._likedBy.asReadonly();

  public readonly likeIds = signal<number[]>([]);

  private readonly _likedByMe = signal<PaginatedResult<User[]> | null>(null);
  public readonly likedByMe: Signal<PaginatedResult<User[]> | null> =
    this._likedByMe.asReadonly();

  private readonly _isFetchingLikes = signal<boolean>(false);
  public readonly isFetchingLikes: Signal<boolean> =
    this._isFetchingLikes.asReadonly();

  constructor(private _httpClient: HttpClient) {}

  toggleLike(targetId: number) {
    return this._httpClient.post(`${LikesEndpoint}/${targetId}`, {});
  }

  getLikeIds() {
    this._httpClient.get<number[]>(LikesEndpoint + '/list').subscribe({
      next: (response) => {
        this.likeIds.set(response);
      },
    });
  }

  getLikes(predicate: PredicateTypes, paginationParams: PaginationParams) {
    let params = new HttpParams();
    params = params.append('predicate', predicate);
    params = setPaginationParams(params, paginationParams);

    this._httpClient
      .get<User[]>(LikesEndpoint, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) => {
          this.updateLikes(response, predicate);
          this._isFetchingLikes.set(false);
        },
        error: () => this._isFetchingLikes.set(false),
      });
  }

  updateLikes(response: HttpResponse<User[]>, predicate: PredicateTypes) {
    switch (predicate) {
      case PredicateTypes.liked:
        setPaginatedResult(response, this._likedByMe);
        break;
      case PredicateTypes.likedBy:
        setPaginatedResult(response, this._likedBy);
        break;
      default:
        setPaginatedResult(response, this._matches);
        break;
    }
  }
}
