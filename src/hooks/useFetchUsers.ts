import { useCallback, useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { useDebounce } from 'use-debounce';
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
  isLoaded: boolean;
  loadMoreUsers: (inView: boolean) => void;
  isLoadMoreUsers: boolean;
};

export const useFetchUsers: TUseFetchUsers = (query) => {
  const [usersData, setUsersData] = useState<IFullUser[]>([]);
  const [favUsers, setFavUsers] = useState<IFullUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const isLoadMoreUsers = usersData.length < totalUsersCount;

  const [debouncedQuery] = useDebounce(query, QUERY_DEBOUNCE_TIME);

  useEffect(() => {
    const isShowQueryWarning =
      !!debouncedQuery && debouncedQuery.length < MINIMAL_QUERY_LENGTH;

    if (isShowQueryWarning) {
      console.log('Query must have at least 3 symbols');
    }
  }, [debouncedQuery]);

  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[],
    []
  >('favoriteUsers', []);

  const localStorageLogins = useMemo(
    () => localStorageData.map((user: IFullUser) => user.login),
    [localStorageData]
  );

  const fetchData = useCallback(
    async (query: string) => {
      setLoading(true);

      try {
        const { data, totalCount } = await getUsersData(query, page);

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

          const isDataExist = !!data.length;
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
      setIsLoaded(true);
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

  useEffect(() => {
    const isQueryMeetRequirements = query.length >= MINIMAL_QUERY_LENGTH;

    if (isQueryMeetRequirements) {
      fetchDataDebounced(query);
    }
  }, [fetchDataDebounced, query]);

  useEffect(() => {
    const favoritesUsers = localStorageData.filter((user: IFullUser) => {
      return user.isFavorite;
    });

    setFavUsers(favoritesUsers);
  }, [localStorageData]);

  useEffect(() => {
    setPage(1);
    setUsersData([]);

    if (!query.length) {
      setTotalUsersCount(0);
    }
  }, [query]);

  useEffect(() => {
    if (!!usersData.length && !isLoadMoreUsers) {
      console.log('Yoe reached the end of the search results');
    }
  }, [isLoadMoreUsers, usersData]);

  return {
    usersData,
    setUsersData,
    loading,
    error,
    page,
    localStorageData,
    setLocalStorageData,
    favUsers,
    isLoaded,
    loadMoreUsers,
    isLoadMoreUsers,
  };
};
