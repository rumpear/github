import { useState } from 'react';
import { SearchField, CardsList, UserCard } from './components';
import { Button } from './components/ui';
import { getUniqueUsersData, toggleIsFavProp } from './utils';
import { MINIMAL_QUERY_LENGTH, SWITCH_BTN_LABELS } from './constants';
import { useFetchUsers } from './hooks';
import { IFullUser } from './interfaces';
import './App.scss';

const App = () => {
  const [query, setQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);
  // console.log(query, 'query');
  const {
    usersData,
    setUsersData,
    loading,
    error,
    nextPage,
    page,
    totalPages,
    localStorageData,
    setLocalStorageData,
    favUsers,
  } = useFetchUsers(query);

  const users = isSearchMode ? usersData : favUsers;
  const isUsersExist = !!users.length;
  const isShowQueryWarning =
    query.length >= 1 && query.length < MINIMAL_QUERY_LENGTH;
  // const isWarning = !isUsersExist && !loading && (query || !isSearchMode);

  const isWarning =
    !isUsersExist && !loading && (query.length >= 4 || !isSearchMode);

  // console.log(!isUsersExist, '!isUsersExist');
  // console.log(!loading, '!loading');
  // console.log(!isSearchMode, '!isSearchMode');
  // console.log(query.length >= 3, 'query.length >= 3');
  // console.log(query.length >= 3 && !loading, 'query.length >= 3 && !loading');
  // console.log(
  //   (query.length >= 3 && !loading) || !isSearchMode,
  //   '(query.length >= 3 && !loading) || !isSearchMode)'
  // );
  // console.log(isWarning, 'isWarning');

  if (isShowQueryWarning) {
    console.log('query must have at least 3 symbols');
  }

  const isError = !!error && !loading && !isUsersExist;
  const isLoadMoreUsers = page < totalPages;
  const isSearchLoading = page === 1 && loading;
  const isCardListLoading = isSearchMode && loading;
  const isCardListLoadMoreUsers = isSearchMode && isLoadMoreUsers;

  const switchBtnLabel = isSearchMode
    ? SWITCH_BTN_LABELS.favorites
    : SWITCH_BTN_LABELS.search;

  const toggleSearchMode = () => {
    setIsSearchMode((prev: boolean) => !prev);
  };

  const toggleCurrentUser = (user: IFullUser | null = null) => {
    setCurrentUser(user);
  };

  const loadMoreUsers = (inView: boolean): void => {
    if (inView && !loading) {
      nextPage();
    }
  };

  const toggleFavoriteUser = (user: IFullUser) => {
    const { login, isFavorite } = user;

    setCurrentUser((prev: IFullUser | null) => {
      return user.id === prev?.id
        ? { ...prev, isFavorite: !prev.isFavorite }
        : prev;
    });

    if (isFavorite) {
      const filteredUsers = localStorageData.filter((user: IFullUser) => {
        return user.login !== login;
      });
      setLocalStorageData(filteredUsers);
      setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, login));
      return;
    }

    const toggledUser = [{ ...user, isFavorite: !user.isFavorite }];
    setUsersData((prev: IFullUser[]) => toggleIsFavProp(prev, login));

    const isLocalStorageDataExist = localStorageData.length;
    if (isLocalStorageDataExist) {
      setLocalStorageData((prev: IFullUser[]) => {
        const uniqueUsersData = getUniqueUsersData(prev, toggledUser);
        return [...uniqueUsersData, ...prev];
      });
      return;
    }
    setLocalStorageData(toggledUser);
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
            loading={isSearchLoading}
          />
        </div>
      )}

      {isUsersExist && (
        <CardsList
          users={users}
          loading={isCardListLoading}
          isShowNextPage={isCardListLoadMoreUsers}
          loadMoreUsers={loadMoreUsers}
          toggleFavoriteUser={toggleFavoriteUser}
          toggleCurrentUser={toggleCurrentUser}
        />
      )}
      {isWarning && <p className='CardList-warning'>Nothing there</p>}
      {isError && <h1>Something went wrong</h1>}

      {/* {isCardLoading && <p className='CardList-loading'>Loading...</p>} */}

      {!!currentUser && (
        <UserCard
          user={currentUser}
          toggleCurrentUser={toggleCurrentUser}
          toggleFavoriteUser={toggleFavoriteUser}
        />
      )}
    </div>
  );
};

export default App;
