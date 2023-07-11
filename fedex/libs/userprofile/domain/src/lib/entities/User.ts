import { RequestStatus } from './RequestStatus';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  thumbnailUrl: string;
}

export type UserDetails = IUser & {
  id: number;
};

export type UserStatus = {
  data: UserDetails | null;
  status: RequestStatus;
};

export type User = Omit<IUser, 'thumbnailUrl'>;
