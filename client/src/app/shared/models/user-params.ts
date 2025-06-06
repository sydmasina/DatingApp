export class UserParams {
  gender: string = 'all';
  minAge: number = 18;
  maxAge: number = 79;
  pageNumber: number = 1;
  pageSize: number = 5;
  country: string = '';
  city: string = '';
  orderBy: string = 'lastActive';
}

export class PaginationParams {
  pageNumber: number = 1;
  pageSize: number = 5;
}
