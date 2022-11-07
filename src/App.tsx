import { useState } from 'react';
import { SearchField, CardsList, UserCard } from './components';
import { getUniqueUsersData, toggleIsFavProp } from './utils';
import { Button } from './components/ui';
import { useFetchUsers } from './hooks';
import { IFullUser } from './interfaces';
import './App.scss';

const App = () => {
  const [query, setQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);

  const {
    usersData,
    setUsersData,
    loading,
    error,
    nextPage,
    goToPage,
    page,
    totalPages,
    localStorageData,
    setLocalStorageData,
    favUsers,
  } = useFetchUsers(query);

  const isUsersDataExist = !!usersData?.length;
  const isError = !loading && error && !isUsersDataExist;
  const isLoading = loading && !isUsersDataExist;
  // const isReadyToRender = !loading && !error && isUsersDataExist;
  // console.log(isReadyToRender, 'isReadyToRender');
  const isShowNextPage = page < totalPages;
  const switchBtnLabel = isSearchMode
    ? 'Switch to Favorites'
    : 'Switch to Search';

  const toggleSearchMode = () => {
    setIsSearchMode((prev: boolean) => !prev);
  };

  const showCurrentUser = (user: IFullUser) => {
    setCurrentUser(user);
  };

  const closeCurrentUser = () => {
    setCurrentUser(null);
  };

  const goToNextPage = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  const toggleFavoriteUser = (currUserLogin: string, isFavorite: boolean) => {
    if (isFavorite) {
      const filteredUsers = localStorageData.filter((user: IFullUser) => {
        return user.login !== currUserLogin;
      });
      setLocalStorageData(filteredUsers);
      setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, currUserLogin));
      return;
    }

    const currentUser = usersData
      .filter((user: IFullUser) => {
        return user.login === currUserLogin;
      })
      .map((user: IFullUser) => {
        return { ...user, isFavorite: !user.isFavorite };
      });

    setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, currUserLogin));

    const isLocalStorageHasData = localStorageData.length;

    if (isLocalStorageHasData) {
      setLocalStorageData((prev: IFullUser[]) => {
        const uniqueUsersData = getUniqueUsersData(prev, currentUser);
        return [...uniqueUsersData, ...prev];
      });
      return;
    }

    setLocalStorageData(currentUser);
  };

  return (
    <div className='App'>
      <div className='App-switchBtn'>
        <Button
          onClick={toggleSearchMode}
          aria-label='Switch to search or favorites'
        >
          {switchBtnLabel}
        </Button>
      </div>

      {isSearchMode ? (
        <>
          <div className='App-searchField'>
            <SearchField setQuery={setQuery} goToPage={goToPage} />
          </div>

          {isLoading && <h1>Loading</h1>}
          {isError && <h1>Something went wrong</h1>}
          {/* {!loading && !isUsersDataExist && (
        <h1>Nothing was found on your request</h1>
      )} */}

          {isUsersDataExist && (
            <CardsList
              users={usersData}
              loading={loading}
              isShowNextPage={isShowNextPage}
              toggleFavoriteUser={toggleFavoriteUser}
              showCurrentUser={showCurrentUser}
              goToNextPage={goToNextPage}
            />
          )}
        </>
      ) : (
        <>
          {!!favUsers.length ? (
            <CardsList
              users={favUsers}
              isShowNextPage={isShowNextPage}
              toggleFavoriteUser={toggleFavoriteUser}
              showCurrentUser={showCurrentUser}
            />
          ) : (
            <h1>Nothing there</h1>
          )}
        </>
      )}

      {!!currentUser && (
        <UserCard user={currentUser} closeUser={closeCurrentUser} />
      )}
    </div>
  );
};

export default App;
