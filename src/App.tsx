import { useState } from 'react';
import { SearchField, CardsList, UserCard } from './components';
import { Button } from './components/ui';
import { getUniqueUsersData, toggleIsFavProp } from './utils';
import { SWITCH_BTN_LABELS } from './constants';
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

  const users = isSearchMode ? usersData : favUsers;
  const isUsersExist = !!users.length;
  const isWarning = !isUsersExist && !loading && (query || !isSearchMode);
  const isError = !!error && !loading && !isUsersExist;
  const isShowNextPage = page < totalPages;
  const isSearchLoading = page === 1 && loading;

  const switchBtnLabel = isSearchMode
    ? SWITCH_BTN_LABELS.favorites
    : SWITCH_BTN_LABELS.search;

  const toggleSearchMode = () => {
    setIsSearchMode((prev: boolean) => !prev);
    toggleCurrentUser();
  };

  const toggleCurrentUser = (user: IFullUser | null = null) => {
    setCurrentUser(user);
  };

  const goToNextPage = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  const toggleFavoriteUser = (user: IFullUser) => {
    const { login, isFavorite } = user;

    if (isFavorite) {
      const filteredUsers = localStorageData.filter((user: IFullUser) => {
        return user.login !== login;
      });
      setLocalStorageData(filteredUsers);
      setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, login));
      return;
    }

    const currentUser = [{ ...user, isFavorite: !user.isFavorite }];
    setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, login));

    const isLocalStorageDataExist = localStorageData.length;
    if (isLocalStorageDataExist) {
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

      {isSearchMode && (
        <div className='App-searchField'>
          <SearchField
            query={query}
            setQuery={setQuery}
            goToPage={goToPage}
            loading={isSearchLoading}
          />
        </div>
      )}

      {isUsersExist && (
        <CardsList
          users={users}
          loading={isSearchMode && loading}
          isShowNextPage={isSearchMode && isShowNextPage}
          goToNextPage={goToNextPage}
          toggleFavoriteUser={toggleFavoriteUser}
          toggleCurrentUser={toggleCurrentUser}
        />
      )}
      {isWarning && <p className='CardList-warning'>Nothing there</p>}
      {isError && <h1>Something went wrong</h1>}

      {!!currentUser && (
        <UserCard user={currentUser} toggleCurrentUser={toggleCurrentUser} />
      )}
    </div>
  );
};

export default App;
