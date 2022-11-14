import { IFullUser } from '../../interfaces';

export interface ICardsListProps {
  users: IFullUser[];
  isEndOfTheSearchResults: boolean;
  loading: boolean;
  isShowNextPage: boolean;
  loadMoreUsers: (inView: boolean) => void;
  toggleFavoriteUser: (user: IFullUser) => void;
  toggleCurrentUser: (user: IFullUser | null) => void;
}
