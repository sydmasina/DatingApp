export interface Login {
  username: string;
  password: string;
}

export interface LoggedInUser {
  token: string;
  username: string;
  gender: string;
  knowAs: string;
  photoUrl?: string;
}
