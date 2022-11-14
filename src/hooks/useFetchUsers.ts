import { useCallback, useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getUniqueUsersData, customDebounce } from '../utils';
import { MINIMAL_QUERY_LENGTH, QUERY_DEBOUNCE_TIME } from '../constants';
import { getUsersData } from '../services/githubApi';
import { useLocalStorage } from './';
import { IFullUser } from '../interfaces';

export type TUseFetchUsers = (query: string) => {
  usersData: IFullUser[];
  setUsersData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
  favUsers: IFullUser[];
  loading: boolean;
  error: string;
  page: number;
  localStorageData: IFullUser[];
  setLocalStorageData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
  loadMoreUsers: (inView: boolean) => void;
  isLoadMoreUsers: boolean;
  isDataEmpty: boolean;
};

export const useFetchUsers: TUseFetchUsers = (query) => {
  const [usersData, setUsersData] = useState<IFullUser[]>([]);
  const [favUsers, setFavUsers] = useState<IFullUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isDataEmpty, setIsDataEmpty] = useState(false);

  const [page, setPage] = useState(1);
  const isLoadMoreUsers = usersData.length < totalUsersCount;
  const isQueryMeetRequirements = query.length >= MINIMAL_QUERY_LENGTH;

  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[],
    []
  >('favoriteUsers', []);

  const localStorageLogins = useMemo(
    () => localStorageData.map((user: IFullUser) => user.login),
    [localStorageData]
  );

  const favoritesUsers = useMemo(
    () =>
      localStorageData.filter((user: IFullUser) => {
        return user.isFavorite;
      }),
    [localStorageData]
  );

  const fetchData = useCallback(
    async (query: string) => {
      setLoading(true);

      try {
        const { data, totalCount } = await getUsersData(query, page);
        const isDataExist = !!data.length;
        isDataExist ? setIsDataEmpty(false) : setIsDataEmpty(true);

        setUsersData((prev: IFullUser[]) => {
          const uniqueUsersData = getUniqueUsersData(prev, data);

          const uniqueUsersDataWithFavorites = uniqueUsersData.map(
            (user: IFullUser) => {
              return {
                ...user,
                isFavorite: localStorageLogins.includes(user.login),
              };
            }
          );

          return isDataExist
            ? [...prev, ...uniqueUsersDataWithFavorites]
            : prev;
        });

        setTotalUsersCount(totalCount);
      } catch (error) {
        const e = error as Error;
        setError(e.message);
      }
      setLoading(false);
      setPage((prev) => prev + 1);
    },
    [localStorageLogins, page]
  );

  const fetchDataDebounced = useCallback(
    customDebounce<string>(fetchData, QUERY_DEBOUNCE_TIME),
    []
  );

  // * lib Debounce
  // const fetchDataDebounced = useCallback(
  //   debounce(fetchData, QUERY_DEBOUNCE_TIME),
  //   []
  // );

  const loadMoreUsers = (inView: boolean): void => {
    if (inView && !loading) {
      fetchData(query);
    }
  };

  const resetSearch = useCallback(() => {
    setPage(1);
    setUsersData([]);
    setIsDataEmpty(false);

    if (!query.length) {
      setTotalUsersCount(0);
    }
  }, [query]);

  useEffect(() => {
    if (isQueryMeetRequirements) {
      fetchDataDebounced(query);
    }
  }, [fetchDataDebounced, isQueryMeetRequirements, query]);

  useEffect(() => {
    setFavUsers(favoritesUsers);
  }, [favoritesUsers]);

  useEffect(() => {
    resetSearch();
  }, [resetSearch]);

  return {
    usersData,
    setUsersData,
    loading,
    error,
    page,
    localStorageData,
    setLocalStorageData,
    favUsers,
    loadMoreUsers,
    isLoadMoreUsers,
    isDataEmpty,
  };
};
