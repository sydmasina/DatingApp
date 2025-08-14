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

export interface DecryptedToken {
  nameid: string;
  unique_name: string;
  role: string[];
  nbf: number;
  exp: number;
  iat: number;
}
