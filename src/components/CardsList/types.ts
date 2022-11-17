import { IFullUser } from '../../interfaces';

export interface ICardsListProps {
  users: IFullUser[];
  isEndOfTheSearchResults: boolean;
  loading: boolean;
  isShowNextPage: boolean;
  loadMoreUsers: () => void;
  toggleFavoriteUser: (user: IFullUser) => void;
  toggleCurrentUser: (user: IFullUser | null) => void;
}
