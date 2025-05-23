export interface Login {
  username: string;
  password: string;
}

export interface LoggedInUser {
  token: string;
  username: string;
  photoUrl?: string;
}
