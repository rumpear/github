import { useEffect, useState, useCallback } from 'react';
import { SearchField, CardsList, UserCard } from './components';
import { getUniqueUsersData, toggleIsFavProp } from './utils';
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
    setIsSearchMode((prev) => !prev);
  };

  const showCurrentUser = (currentUserLogin: string) => {
    const user = usersData.find((user: IFullUser) => {
      return user.login === currentUserLogin;
    });
    const isUserExist = user ?? null;
    setCurrentUser(isUserExist);
  };

  const closeCurrentUser = () => {
    setCurrentUser(null);
  };

  const goToNextPage = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  const addToFavorites = (currUserLogin: string) => {
    const currentUser = usersData
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
          return [...uniqueUsersData, ...prev];
        });

    setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, currUserLogin));
  };

  const removeFromFavorites = (currUserLogin: string) => {
    const currentUser = localStorageData.filter((user) => {
      return user.login !== currUserLogin;
    });

    setLocalStorageData(currentUser);

    setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, currUserLogin));
  };

  return (
    <div className='App'>
      <button
        type='button'
        onClick={toggleSearchMode}
        className='App-switchBtn'
      >
        {switchBtnLabel}
      </button>

      {isSearchMode && (
        <>
          <div className='SearchField-wrapper'>
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
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
              showCurrentUser={showCurrentUser}
              goToNextPage={goToNextPage}
            />
          )}
        </>
      )}

      {!isSearchMode && (
        <>
          {!!favUsers.length ? (
            <CardsList
              users={favUsers}
              isShowNextPage={isShowNextPage}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
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
