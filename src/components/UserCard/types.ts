import { IFullUser } from '../../interfaces';

export interface IUserCardProps {
  user: IFullUser;
  toggleCurrentUser: (user: IFullUser | null) => void;
  toggleFavoriteUser: (user: IFullUser) => void;
}
