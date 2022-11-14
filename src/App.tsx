import { useState } from 'react';
import { SearchField, CardsList, UserCard } from './components';
import { Button } from './components/ui';
import { useFetchUsers } from './hooks';
import { getUniqueUsersData, toggleIsFavProp } from './utils';
import { MESSAGES_LABELS, SWITCH_BTN_LABELS, ARIA_LABELS } from './constants';
import { IFullUser } from './interfaces';
import './App.scss';

const App = () => {
  const [query, setQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<IFullUser | null>(null);

  const {
    usersData,
    setUsersData,
    isDataEmpty,
    loading,
    error,
    page,
    localStorageData,
    setLocalStorageData,
    favUsers,
    loadMoreUsers,
    isLoadMoreUsers,
  } = useFetchUsers(query);

  const users = isSearchMode ? usersData : favUsers;
  const isUsersExist = !!users.length;
  const isEndOfTheSearchResults =
    isUsersExist && !isLoadMoreUsers && isSearchMode;

  const isWarning =
    (isDataEmpty && isSearchMode) || (!isUsersExist && !isSearchMode);

  const isError = !!error && !loading && !isUsersExist;
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
      <Button onClick={toggleSearchMode} aria-label={ARIA_LABELS.switchFav}>
        {switchBtnLabel}
      </Button>

      {isSearchMode && (
        <SearchField
          query={query}
          setQuery={setQuery}
          loading={isSearchLoading}
        />
      )}

      {isUsersExist && (
        <CardsList
          users={users}
          isEndOfTheSearchResults={isEndOfTheSearchResults}
          loading={isCardListLoading}
          isShowNextPage={isCardListLoadMoreUsers}
          loadMoreUsers={loadMoreUsers}
          toggleFavoriteUser={toggleFavoriteUser}
          toggleCurrentUser={toggleCurrentUser}
        />
      )}

      {isWarning && (
        <p className='CardList-warning'>{MESSAGES_LABELS.emptyWarning}</p>
      )}
      {isError && (
        <p className='CardList-error'>{MESSAGES_LABELS.emptyWarning}</p>
      )}

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
