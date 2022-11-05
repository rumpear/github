import { useEffect, useState, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { IFullUser } from '../../interfaces';
import { getUniqueUsersData } from '../../utils/getUniqueUsersData';
import { UserCard } from '../UserCard';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
  loading?: boolean;
  isShowNextPage: boolean;
  addToFavorites: (currUserLogin: string) => void;
  removeFromFavorites: (currUserLogin: string) => void;
  showCurrentUser: (currentUserLogin: string) => void;
  goToNextPage?: (inView: boolean) => void;
}

const CardsList = ({
  users,
  loading = false,
  isShowNextPage,
  addToFavorites,
  removeFromFavorites,
  showCurrentUser,
  goToNextPage,
}: ICardsListProps) => {
  return (
    <>
      <div className='CardList'>
        {users.map((user: IFullUser) => {
          const favoritesBtnLabel = user.isFavorite ? 'Del' : 'Add';
          const cb = user.isFavorite
            ? () => removeFromFavorites(user.login)
            : () => addToFavorites(user.login);

          return (
            <div key={user.login} className='Card'>
              <div
                onClick={() => showCurrentUser(user.login)}
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
                <button type='button' className='Card-favBtn' onClick={cb}>
                  {favoritesBtnLabel}
                </button>

                {/* <button
                  type='button'
                  className='Card-favBtn'
                  onClick={() => addToFavorites(user.login)}
                >
                  Add
                </button>
                <button
                  type='button'
                  className='Card-favBtn'
                  onClick={() => removeFromFavorites(user.login)}
                >
                  Del
                </button> */}
              </div>
            </div>
          );
        })}

        {isShowNextPage && (
          <InView
            as='div'
            className='Card-nextPageBtn'
            onChange={goToNextPage}
          />
        )}

        {loading && <p className='CardList-loading'>Loading...</p>}
      </div>
    </>
  );
};

export default CardsList;
