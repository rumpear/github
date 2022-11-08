import { InView } from 'react-intersection-observer';
import { FAVORITES_BTN_LABEL } from '../../constants';
import { IFullUser } from '../../interfaces';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
  loading?: boolean;
  isShowNextPage: boolean;
  toggleFavoriteUser: (user: IFullUser) => void;
  showCurrentUser: (user: IFullUser) => void;
  goToNextPage: (inView: boolean) => void;
}

const CardsList = ({
  users,
  loading = false,
  isShowNextPage,
  toggleFavoriteUser,
  showCurrentUser,
  goToNextPage,
}: ICardsListProps) => {
  const isLoading = !!users.length && loading;

  return (
    <div className='CardList'>
      {users.map((user: IFullUser) => {
        const favoritesBtnLabel = user.isFavorite
          ? FAVORITES_BTN_LABEL.delete
          : FAVORITES_BTN_LABEL.add;

        return (
          <div key={user.login} className='Card'>
            <div
              onClick={() => showCurrentUser(user)}
              className='Card-container'
            >
              <div className='Card-thumb'>
                <img
                  className='Card-avatar'
                  src={user.avatar_url}
                  alt={user.login}
                />
              </div>
              <div className='Card-textWrapper'>
                <p className='Card-login'>{user.login}</p>
                <p className='Card-bio'>{user.bio}</p>
              </div>
            </div>
            <div className='Card-favBtn-wrapper'>
              <button
                type='button'
                className='Card-favBtn'
                onClick={() => toggleFavoriteUser(user)}
              >
                {favoritesBtnLabel}
              </button>
            </div>
          </div>
        );
      })}

      {isShowNextPage && (
        <InView as='div' className='Card-nextPageBtn' onChange={goToNextPage} />
      )}

      {isLoading && <p className='CardList-loading'>Loading...</p>}
    </div>
  );
};

export default CardsList;
