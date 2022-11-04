import { useCallback, useEffect, useState, useMemo } from 'react';
import { getAdditionalUsersData, getUniqueUsersData } from '../utils';
import { MINIMAL_QUERY_LENGTH, PER_PAGE } from '../constants';
import { getUsersData } from '../services/githubApi';
import { usePagination, useLocalStorage } from './';
import { IFullUser } from '../services/types';

export type TUseFetchUsers = (query: string) => {
  usersData: IFullUser[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  nextPage: () => void;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
  setUsersData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
  localStorageData: IFullUser[];
  setLocalStorageData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
  favUsers: IFullUser[];
};

export const useFetchUsers: TUseFetchUsers = (query) => {
  const [usersData, setUsersData] = useState<IFullUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [favUsers, setFavUsers] = useState<IFullUser[]>([]);

  const { page, totalPages, nextPage, goToPage } = usePagination(
    PER_PAGE,
    totalUsersCount
  );

  const { localStorageData, setLocalStorageData } = useLocalStorage<
    IFullUser[],
    []
  >('favoriteUsers', []);

  useEffect(() => {
    const favoritesUsers = localStorageData
      .filter((user) => {
        return user.isFavorite;
      })
      .reverse();
    setFavUsers(favoritesUsers);
  }, [localStorageData]);

  // const lsLogins = useMemo(
  //   () => localStorageData.map((user) => user.login),
  //   [localStorageData]
  // );
  const lsLogins = localStorageData.map((user) => user.login);

  useEffect(() => {
    setUsersData([]);

    if (!query.length) {
      setTotalUsersCount(0);
    }
  }, [query]);

  const fetchData = useCallback(async () => {
    const isQueryLessThanReqLength = query.length < MINIMAL_QUERY_LENGTH;

    if (!query || isQueryLessThanReqLength) {
      return;
    }

    setLoading(true);
    try {
      const data = await getUsersData(query, page);
      const additionalData = await getAdditionalUsersData(data.items);
      const isAdditionalDataExist = !!additionalData.length;

      setUsersData((prev) => {
        const uniqueUsersData = getUniqueUsersData(prev, additionalData);

        const uniqueUsersDataWithFavorites = uniqueUsersData.map((user) =>
          lsLogins.includes(user.login)
            ? { ...user, isFavorite: true }
            : { ...user, isFavorite: false }
        );

        return isAdditionalDataExist
          ? [...prev, ...uniqueUsersDataWithFavorites]
          : prev;
      });

      setTotalUsersCount(data.total_count);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    }
    setLoading(false);
  }, [query, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
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
  };
};

const toggleIsFavProp = (prev: IFullUser[], currUserLogin: string) => {
  return prev.map((user) => {
    if (user.login === currUserLogin) {
      return { ...user, isFavorite: !user.isFavorite };
    }
    return user;
  });
};
