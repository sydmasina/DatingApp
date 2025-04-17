export interface User {
  id: number;
  userName: string;
  age: string;
  knownAs: string;
  photoUrl: string;
  created: string;
  lastActive: string;
  gender: string;
  introduction: string;
  interests: string;
  lookingFor: string;
  city: string;
  country: string;
  photos: Photo[];
}

export interface Photo {
  id: number;
  url: string;
  isMain: boolean;
}
