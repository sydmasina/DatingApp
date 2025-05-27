import { City, Country } from './static-data';

export interface Register {
  username: string;
  password: string;
}

export interface RegisterFormValues {
  userName: string;
  password: string;
  age: string;
  knownAs: string;
  gender: string;
  introduction: string;
  interests: string;
  lookingFor: string;
  city: City | string;
  country: Country;
  dateOfBirth: string;
}

export interface RegisterDto {
  userName: string;
  password: string;
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
