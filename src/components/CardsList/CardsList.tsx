import { useEffect, useRef } from 'react';
import { InView } from 'react-intersection-observer';
import { IFullUser } from '../../interfaces';
import './CardsList.style.scss';

const FAVORITES_BTN_LABEL = { delete: 'Del', add: 'Add' };

interface ICardsListProps {
  users: IFullUser[];
  loading?: boolean;
  isShowNextPage: boolean;
  toggleFavoriteUser: (currUserLogin: string, isFavorite: boolean) => void;
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
  const isUserDataExist = !!users.length;

  // useRef
  // useEffect

  return (
    <div className='CardList'>
      {isUserDataExist ? (
        users.map((user: IFullUser) => {
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
                  onClick={() =>
                    toggleFavoriteUser(user.login, user.isFavorite)
                  }
                >
                  {favoritesBtnLabel}
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className='CardList-warning'>Nothing there</p>
      )}

      {isShowNextPage && (
        <InView as='div' className='Card-nextPageBtn' onChange={goToNextPage} />
      )}

      {loading && <p className='CardList-loading'>Loading...</p>}
    </div>
  );
};

export default CardsList;
