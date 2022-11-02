import { useState } from 'react';
import { InView } from 'react-intersection-observer';
import { useLocalStorage } from '../../hooks';
import { IFullUser } from '../../services/types';
import { UserCard } from '../UserCard';
import './CardsList.style.scss';

interface ICardsListProps {
  users: IFullUser[];
  nextPage: () => void;
  totalPages: number;
  page: number;
  loading: boolean;
}

const CardsList = ({
  users,
  nextPage,
  page,
  totalPages,
  loading,
}: ICardsListProps) => {
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);
  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[]
  >('favoriteUsers', []);

  const showNextPage = page < totalPages;

  const handleCardClick = (currentUserLogin: string) => {
    const user = users.find((user) => user.login === currentUserLogin);
    const isUserExist = user ?? null;
    setCurrentUser(isUserExist);
  };

  const resetUser = () => {
    setCurrentUser(null);
  };

  const handlePageChange = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  const addToFavorites = (currentUserLogin: string) => {
    const user = users.filter((user) => user.login === currentUserLogin);
    // console.log(user, 'user');
    // console.log(localStorageData, 'localStorageData');

    // const usersLogins = localStorageData.map((user) => user.login);
    // console.log(usersLogins, 'usersLogins');
    // const uniqueUsersData = localStorageData.filter((user) => {
    //   console.log(user.login, 'user.login');
    //   console.log(usersLogins.includes(user.login));
    //   return !usersLogins.includes(user.login);
    // });

    // console.log(uniqueUsersData, 'uniqueUsersData');

    // console.log(
    //   !localStorageData.length && !!user,
    //   '!!localStorageData.length && !!user'
    // );
    // console.log(!!user, '!!user');
    // console.log(!localStorageData.length, '!!localStorageData.length');
    // console.log(localStorageData, 'localStorageData addToFavorites');

    if (!localStorageData.length && !!user) {
      return setLocalStorageData(user);
    }

    if (user) {
      setLocalStorageData((prev) => {
        console.log(prev, 'prev');
        const uniqueUsersData = prev.filter((user) => {
          return user.login !== currentUserLogin;
        });
        console.log(uniqueUsersData, 'uniqueUsersData');

        // const usersLogins = prev.map((user) => user.login);

        // console.log(usersLogins, 'usersLogins');
        // const uniqueUsersData = user.filter((user) => {
        //   console.log(user.login, 'user.login');
        //   console.log(usersLogins.includes(user.login));
        //   return !usersLogins.includes(user.login);
        // });
        // console.log(uniqueUsersData, 'uniqueUsersData');
        return [...prev, ...uniqueUsersData];
      });
    }
  };

  console.log(localStorageData, 'localStorageData');

  return (
    <>
      <div className='Card-wrapper'>
        {users.map((user: IFullUser) => {
          return (
            <div key={user.login} className='Card'>
              <div onClick={() => handleCardClick(user.login)}>
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
              <button
                type='button'
                className='Card-favBtn'
                onClickCapture={() => addToFavorites(user.login)}
              >
                Fav
              </button>
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
      </div>
      {!!currentUser && <UserCard user={currentUser} resetUser={resetUser} />}
    </>
  );
};

export default CardsList;
