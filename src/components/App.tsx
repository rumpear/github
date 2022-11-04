import { useEffect, useState, useCallback } from 'react';
import { useFetchUsers, useLocalStorage } from '../hooks';
import { IFullUser } from '../services/types';
import { SearchField, CardsList } from '.';
import './App.style.scss';

const App = () => {
  const [query, setQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);

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
  const switchBtnLabel = isSearchMode
    ? 'Switch to Favorites'
    : 'Switch to Search';

  const toggleSearchMode = () => {
    setIsSearchMode((prev) => !prev);
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
