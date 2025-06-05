import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal, Signal } from '@angular/core';
import { LikesEndpoint } from '../constants/api-enpoints/likes';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private readonly _matches = signal<User[]>([]);
  public readonly matches: Signal<User[]> = this._matches.asReadonly();

  private readonly _likedBy = signal<User[]>([]);
  public readonly likedBy: Signal<User[]> = this._likedBy.asReadonly();

  public readonly likeIds = signal<number[]>([]);

  private readonly _likedByMe = signal<User[]>([]);
  public readonly likedByMe: Signal<User[]> = this._likedByMe.asReadonly();

  private readonly _isFetchingMatches = signal<boolean>(false);
  public readonly isFetchingMatches: Signal<boolean> =
    this._isFetchingMatches.asReadonly();

  private readonly _isFetchingLikedBy = signal<boolean>(false);
  public readonly isFetchingLikedBy: Signal<boolean> =
    this._isFetchingLikedBy.asReadonly();

  private readonly _isFetchingLikedByMe = signal<boolean>(false);
  public readonly isFetchingLikedByMe: Signal<boolean> =
    this._isFetchingLikedBy.asReadonly();

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

  getMatches() {
    if (this.isFetchingMatches()) {
      return;
    }

    let params = new HttpParams();
    params = params.append('predicate', 'matches');

    this._httpClient.get<User[]>(LikesEndpoint, { params }).subscribe({
      next: (response) => {
        this._matches.set(response);
        this._isFetchingMatches.set(false);
      },
      error: () => this._isFetchingMatches.set(false),
    });
  }

  getLikedBy() {
    if (this.isFetchingLikedBy()) {
      return;
    }

    let params = new HttpParams();
    params = params.append('predicate', 'likedBy');

    this._httpClient.get<User[]>(LikesEndpoint, { params }).subscribe({
      next: (response) => {
        this._likedBy.set(response);
        this._isFetchingLikedBy.set(false);
      },
      error: () => this._isFetchingLikedBy.set(false),
    });
  }

  getLikedByMe() {
    if (this.isFetchingLikedByMe()) {
      return;
    }

    let params = new HttpParams();
    params = params.append('predicate', 'liked');

    this._httpClient.get<User[]>(LikesEndpoint, { params }).subscribe({
      next: (response) => {
        this._likedByMe.set(response);
        this._isFetchingLikedByMe.set(false);
      },
      error: () => this._isFetchingLikedByMe.set(false),
    });
  }
}
