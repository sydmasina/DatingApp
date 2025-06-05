import { HttpParams, HttpResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/user-params';

export function formatToDateOnly(date: string): string {
  const dateToFormat = new Date(date);

  if (dateToFormat.toString() == 'Invalid Date') {
    throw new Error('Invalid Date');
  }

  const year = dateToFormat.getFullYear();
  const month = String(dateToFormat.getMonth() + 1).padStart(2, '0');
  const day = String(dateToFormat.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // "yyyy-MM-dd"
}

export function setPaginatedResult<T>(
  response: HttpResponse<T>,
  paginatedResult: ReturnType<typeof signal<PaginatedResult<T> | null>>
) {
  paginatedResult.set({
    items: response.body as T,
    pagination: JSON.parse(response.headers.get('Pagination')!),
  });
}

export function setPaginationParams(
  params: HttpParams,
  userParams: UserParams
): HttpParams {
  params = params.append('pageNumber', userParams.pageNumber);
  params = params.append('pageSize', userParams.pageSize);
  return params;
}
