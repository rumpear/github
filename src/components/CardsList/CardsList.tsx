import { useEffect, useState, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { IFullUser } from '../../services/types';
import { getUniqueUsersData } from '../../utils/getUniqueUsersData';
import { UserCard } from '../UserCard';
import './CardsList.style.scss';

const toggleIsFavProp = (prev: IFullUser[], currUserLogin: string) => {
  return prev.map((user) => {
    if (user.login === currUserLogin) {
      return { ...user, isFavorite: !user.isFavorite };
    }
    return user;
  });
};

interface ICardsListProps {
  users: IFullUser[];
  nextPage?: () => void;
  totalPages?: number;
  page?: number;
  loading?: boolean;
  setUsersData?: React.Dispatch<React.SetStateAction<IFullUser[]>>;
  isSearchMode: boolean;
  localStorageData: IFullUser[];
  setLocalStorageData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
}

const CardsList = ({
  users,
  nextPage = () => {},
  page = 1,
  totalPages = 1,
  loading = false,
  setUsersData = () => {},
  isSearchMode,
  localStorageData,
  setLocalStorageData,
}: ICardsListProps) => {
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);

  const showNextPage = page < totalPages;

  const handleCardClick = (currentUserLogin: string) => {
    const user = users.find((user: IFullUser) => {
      return user.login === currentUserLogin;
    });
    const isUserExist = user ?? null;
    setCurrentUser(isUserExist);
  };

  const resetCurrentUser = () => {
    setCurrentUser(null);
  };

  const handlePageChange = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  const addToFavorites = (currUserLogin: string) => {
    const currentUser = users
      .filter((user) => {
        return user.login === currUserLogin;
      })
      .map((user) => {
        return { ...user, isFavorite: !user.isFavorite };
      });

    const isLocalStorageEmpty = !localStorageData.length;

    isLocalStorageEmpty
      ? setLocalStorageData(currentUser)
      : setLocalStorageData((prev) => {
          const uniqueUsersData = getUniqueUsersData(prev, currentUser);
          return [...prev, ...uniqueUsersData];
        });

    setUsersData((prev) => toggleIsFavProp(prev, currUserLogin));
  };

  const removeFromFavorites = (currUserLogin: string) => {
    const currentUser = localStorageData.filter((user) => {
      return user.login !== currUserLogin;
    });

    setLocalStorageData(currentUser);

    setUsersData((prev) => toggleIsFavProp(prev, currUserLogin));
  };

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
                onClick={() => handleCardClick(user.login)}
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

        {showNextPage && (
          <InView
            as='div'
            className='Card-nextPageBtn'
            onChange={handlePageChange}
          />
        )}

        {loading && <p className='CardList-loading'>Loading...</p>}
      </div>

      {!!currentUser && (
        <UserCard user={currentUser} resetUser={resetCurrentUser} />
      )}
    </>
  );
};

export default CardsList;
