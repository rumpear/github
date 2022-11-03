import { useEffect, useState } from 'react';
import { useFetchUsers, useLocalStorage } from '../hooks';
import { IFullUser } from '../services/types';
import { SearchField, CardsList } from './';
import './App.style.scss';

type TMode = 'search' | 'favorites';

function App() {
  const [query, setQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  console.log(isSearchMode, 'isSearchMode');

  const { localStorageData } = useLocalStorage<IFullUser[], []>(
    'favoriteUsers'
  );
  // console.log(localStorageData, 'localStorageData');

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
  // console.log(usersData, 'usersData');

  const isUsersDataExist = !!usersData.length;
  const isError = !loading && error && !isUsersDataExist;
  const isLoading = loading && !isUsersDataExist;
  // const isReadyToRender = !loading && !error && isUsersDataExist;
  // console.log(isReadyToRender, 'isReadyToRender');
  console.log(localStorageData.length, 'localStorage.length');
  return (
    <div className='App'>
      <button
        type='button'
        onClick={() => setIsSearchMode((prev) => !prev)}
        className='SwitchBtn'
      >
        {isSearchMode ? 'Switch to Favorites' : 'Switch to Search'}
      </button>
      {isSearchMode ? (
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
              // localStorageData
              // setLocalStorageData
            />
          )}
        </>
      ) : (
        <>
          {!!localStorageData.length ? (
            <CardsList users={localStorageData} />
          ) : (
            <h1>Nothing there</h1>
          )}
        </>
      )}
    </div>
  );
}

export default App;
