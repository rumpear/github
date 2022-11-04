import { useEffect, useState, useMemo } from 'react';
import { InView } from 'react-intersection-observer';
import { useLocalStorage } from '../../hooks';
import { IFullUser } from '../../services/types';
import { getUniqueUsersData } from '../../utils/getUniqueUsersData';
import { UserCard } from '../UserCard';
import './CardsList.style.scss';

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
    // const currentUser = users.filter((user) => user.login === currUserLogin);

    const currentUser = users
      .filter((user) => user.login === currUserLogin)
      .map((user) => {
        // console.log(user, 'user');
        // console.log(user.isFavorite, 'user.isFavorite');
        return { ...user, isFavorite: !user.isFavorite };
      });

    // setUsersData((prev) => {
    //   // console.log(prev, 'prev');
    //   // console.log(currentUser, 'currentUser');
    //   prev.forEach((user) => {
    //     if (user.login === currUserLogin) {
    //       user.isFavorite = !user.isFavorite;
    //     }
    //   });
    //   // console.log(prev, 'prev');

    //   // return [...prev, ...currentUser];
    //   return prev;
    // });

    // setUsersData((prev) => {
    //   const uniqueUsersData = getUniqueUsersData(prev, currentUser);
    //   return [...prev, ...uniqueUsersData];
    // });

    const isLocalStorageEmpty = !localStorageData.length;
    console.log(currentUser, 'currentUser');
    console.log(currentUser[0].isFavorite, 'currentUser.isFavorite');

    setUsersData((prev) => {
      return prev.map((user) => {
        if (user.login === currUserLogin) {
          return { ...user, isFavorite: !user.isFavorite };
        }
        return user;
      });
    });

    isLocalStorageEmpty
      ? setLocalStorageData(currentUser)
      : setLocalStorageData((prev) => {
          const uniqueUsersData = getUniqueUsersData(prev, currentUser);

          return [...prev, ...uniqueUsersData];

          // * test
          // const uniqueUsersDataWithFavorites = uniqueUsersData.map((user) => {
          //   return { ...user, isFavorite: false };
          // });

          // return [...prev, ...uniqueUsersDataWithFavorites];
        });
  };

  const removeFromFavorites = (currUserLogin: string) => {
    const currentUser = localStorageData.filter(
      (user) => user.login !== currUserLogin
    );
    // console.log(currentUser, 'currentUser');
    // const isLocalStorageEmpty = !localStorageData.length;
    setLocalStorageData(currentUser);

    setUsersData((prev) => {
      return prev.map((user) => {
        if (user.login === currUserLogin) {
          return { ...user, isFavorite: !user.isFavorite };
        }
        return user;
      });
    });
  };

  return (
    <>
      <div className='CardList'>
        {users.map((user: IFullUser) => {
          const favoritesBtnLabel = user.isFavorite ? 'Del' : 'Add';
          const cb = user.isFavorite
            ? () => removeFromFavorites(user.login)
            : () => addToFavorites(user.login);
          // console.log(user, 'user');
          // console.log(user.isFavorite, 'user.isFavorite');

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
