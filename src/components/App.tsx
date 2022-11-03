import { useEffect, useState, useCallback } from 'react';
import { useFetchUsers, useLocalStorage } from '../hooks';
import { IFullUser } from '../services/types';
import { SearchField, CardsList } from '.';
import './App.style.scss';

// type TMode = 'search' | 'favorites';

const App = () => {
  const [query, setQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [favUsers, setFavUsers] = useState<IFullUser[]>([]);
  // console.log(isSearchMode, 'isSearchMode');
  // console.log(favUsers, 'favUsers');

  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[],
    []
  >('favoriteUsers', []);

  // console.log(localStorageData, 'localStorageData');
  // console.log(localStorageData.length, 'localStorage.length');

  const toggleSearchMode = () => {
    setIsSearchMode((prev) => !prev);
  };

  // remove favorites
  useEffect(() => {
    const favoritesUsers = localStorageData
      .filter((user) => {
        return user.isFavorite;
      })
      .reverse();
    setFavUsers(favoritesUsers);
  }, [localStorageData]);

  const {
    usersData,
    setUsersData,
    loading,
    error,
    nextPage,
    goToPage,
    page,
    totalPages,
  } = useFetchUsers(query);
  console.log(usersData, 'usersData App');

  // const syncDataWithLocalStorage = useCallback(() => {
  //   usersData.forEach((user) => {
  //     localStorageData.forEach((local) => {
  //       if (user.login === local.login) {
  //         user.isFavorite = local.isFavorite;
  //       }
  //     });
  //   });
  // }, [localStorageData, usersData]);

  // useEffect(() => {
  //   syncDataWithLocalStorage();
  // }, [syncDataWithLocalStorage]);

  useEffect(() => {
    const syncDataWithLocalStorage = () => {
      usersData.forEach((user) => {
        localStorageData.forEach((local) => {
          if (user.login === local.login) {
            user.isFavorite = local.isFavorite;
          }
        });
      });
    };
    syncDataWithLocalStorage();
  }, [localStorageData, usersData]);

  // const syncDataWithLocalStorage = () => {
  //   usersData.forEach((user) => {
  //     localStorageData.forEach((local) => {
  //       if (user.login === local.login) {
  //         user.isFavorite = local.isFavorite;
  //       }
  //     });
  //   });
  // };
  // syncDataWithLocalStorage();
  const isUsersDataExist = !!usersData.length;
  const isError = !loading && error && !isUsersDataExist;
  const isLoading = loading && !isUsersDataExist;
  // const isReadyToRender = !loading && !error && isUsersDataExist;
  // console.log(isReadyToRender, 'isReadyToRender');

  const switchBtnLabel = isSearchMode
    ? 'Switch to Favorites'
    : 'Switch to Search';

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
              nextPage={nextPage}
              totalPages={totalPages}
              loading={loading}
              page={page}
              setUsersData={setUsersData}
              isSearchMode={isSearchMode}
              localStorageData={localStorageData}
              setLocalStorageData={setLocalStorageData}
            />
          )}
        </>
      )}

      {!isSearchMode && (
        <>
          {/* {!!favUsers.length ? (
            favUsers.map((user) => <UserCard user={user} />)
          ) : (
            <h1>Nothing there</h1>
          )} */}
          {!!favUsers.length ? (
            <CardsList
              users={favUsers}
              isSearchMode={isSearchMode}
              localStorageData={localStorageData}
              setLocalStorageData={setLocalStorageData}
            />
          ) : (
            <h1>Nothing there</h1>
          )}
        </>
      )}
    </div>
  );
};

export default App;
