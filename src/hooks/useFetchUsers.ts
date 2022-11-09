import { useCallback, useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { getUniqueUsersData } from '../utils';
import {
  MINIMAL_QUERY_LENGTH,
  PER_PAGE,
  QUERY_DEBOUNCE_TIME,
} from '../constants';
import { getUsersData } from '../services/githubApi';
import { usePagination, useLocalStorage } from './';
import { IFullUser } from '../interfaces';

export type TUseFetchUsers = (query: string) => {
  usersData: IFullUser[];
  setUsersData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
  favUsers: IFullUser[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  nextPage: () => void;
  localStorageData: IFullUser[];
  setLocalStorageData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
};

export const useFetchUsers: TUseFetchUsers = (query) => {
  const [usersData, setUsersData] = useState<IFullUser[]>([]);
  const [favUsers, setFavUsers] = useState<IFullUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { page, totalPages, nextPage, goToPage } = usePagination(
    PER_PAGE,
    totalUsersCount
  );

  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[],
    []
  >('favoriteUsers', []);

  const localStorageLogins = useMemo(
    () => localStorageData.map((user: IFullUser) => user.login),
    [localStorageData]
  );

  const fetchData = useCallback(async (query: string, page: number) => {
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
        return isDataExist ? [...prev, ...uniqueUsersDataWithFavorites] : prev;
      });

      setTotalUsersCount(totalCount);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    }
    setLoading(false);
  }, []);

  // * basic
  // useEffect(() => {
  //   const isQueryMeetRequirements = query.length >= MINIMAL_QUERY_LENGTH;
  //   if (isQueryMeetRequirements) {
  //     fetchData(query, page);
  //   }
  // }, [fetchData, page, query]);

  // * debounce
  // const fetchDataDebounced = useCallback(debounce(fetchData, 700), []);
  const fetchDataDebounced = useMemo(
    () => debounce(fetchData, QUERY_DEBOUNCE_TIME),
    [fetchData]
  );

  useEffect(() => {
    const isQueryMeetRequirements = query.length >= MINIMAL_QUERY_LENGTH;
    if (isQueryMeetRequirements) {
      fetchDataDebounced(query, page);
    }
  }, [fetchDataDebounced, page, query]);

  useEffect(() => {
    const favoritesUsers = localStorageData.filter((user: IFullUser) => {
      return user.isFavorite;
    });

    setFavUsers(favoritesUsers);
  }, [localStorageData]);

  useEffect(() => {
    goToPage(1);
    setUsersData([]);

    if (!query.length) {
      setTotalUsersCount(0);
    }
  }, [goToPage, query]);

  return {
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
  };
};
