import { useCallback, useEffect, useState, useMemo } from 'react';
import { getAdditionalUsersData, getUniqueUsersData } from '../utils';
import { MINIMAL_QUERY_LENGTH, PER_PAGE } from '../constants';
import { getUsersData } from '../services/githubApi';
import { usePagination, useLocalStorage } from './';
import { IFullUser } from '../interfaces';

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

  // const lsLogins = useMemo(
  //   () => localStorageData.map((user) => user.login),
  //   [localStorageData]
  // );
  const lsLogins = localStorageData.map((user) => user.login);

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

      setUsersData((prev: IFullUser[]) => {
        const uniqueUsersData = getUniqueUsersData(prev, additionalData);

        const uniqueUsersDataWithFavorites = uniqueUsersData.map(
          (user: IFullUser) => {
            return {
              ...user,
              isFavorite: lsLogins.includes(user.login),
            };
          }
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

  useEffect(() => {
    const favoritesUsers = localStorageData.filter((user) => {
      return user.isFavorite;
    });

    setFavUsers(favoritesUsers);
  }, [localStorageData]);

  useEffect(() => {
    setUsersData([]);

    if (!query.length) {
      setTotalUsersCount(0);
    }
  }, [query]);

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
