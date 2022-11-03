import { useState } from 'react';
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
}

const CardsList = ({
  users,
  nextPage = () => {},
  page = 1,
  totalPages = 1,
  loading = false,
}: ICardsListProps) => {
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);
  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[],
    []
  >('favoriteUsers', []);

  const showNextPage = page! < totalPages!;

  const handleCardClick = (currentUserLogin: string) => {
    const user = users.find((user: IFullUser) => {
      return user.login === currentUserLogin;
    });
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

  const addToFavorites = (currUserLogin: string) => {
    const currentUser = users.filter((user) => user.login === currUserLogin);
    const isLocalStorageEmpty = !localStorageData.length;

    isLocalStorageEmpty
      ? setLocalStorageData(currentUser)
      : setLocalStorageData((prev) => {
          const uniqueUsersData = getUniqueUsersData(prev, currentUser);
          return [...prev, ...uniqueUsersData];
        });
  };

  return (
    <>
      <div className='CardList'>
        {users.map((user: IFullUser) => {
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
                <button
                  type='button'
                  className='Card-favBtn'
                  onClick={() => addToFavorites(user.login)}
                >
                  Fav
                </button>
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

      {!!currentUser && <UserCard user={currentUser} resetUser={resetUser} />}
    </>
  );
};

export default CardsList;
