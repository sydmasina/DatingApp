export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  resultCode?: ResultCode;
}

export enum ResultCode {
  NotFound,
  NoChanges,
  Updated,
}
