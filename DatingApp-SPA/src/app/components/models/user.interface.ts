import { Photo } from './photo.interface';

export interface User {
  id: number;
  username: string;
  knowAs: string;
  age: number;
  number: string;
  created: Date;
  lastActive: Date;
  photoUrl: string;
  city: string;
  country: string;
  interests?: string;
  introduction?: string;
  lookingFor?: string;
  photos?: Photo[];
}
