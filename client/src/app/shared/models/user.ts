import { Photo } from './Photo';
import { Country } from './static-data';

export interface User {
  id: number;
  userName: string;
  age: string;
  knownAs: string;
  photoUrl: string;
  created: string;
  lastActive: string;
  lastSeen: string;
  gender: string;
  introduction: string;
  interests: string;
  lookingFor: string;
  city: string;
  country: string;
  photos: Photo[];
}

export interface UpdateUserDto {
  userName: string;
  age: string;
  knownAs: string;
  gender: string;
  introduction: string;
  interests: string;
  lookingFor: string;
  city: string;
  country: string;
  dateOfBirth: string;
}

export interface UserUpdateFormValues {
  userName: string;
  age: string;
  knownAs: string;
  gender: string;
  introduction: string;
  interests: string;
  lookingFor: string;
  city: string;
  country: Country;
  dateOfBirth: string;
}
