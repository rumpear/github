import { useCallback, useEffect, useState } from 'react';
import { getAdditionalUsersData } from '../utils';
import { getUsersData, PER_PAGE } from '../services/githubApi';
import { IFullUser } from '../services/types';
import { usePagination } from './';

const MINIMAL_QUERY_LENGTH = 3;

export type TUseFetchUsers = (query: string) => {
  usersData: IFullUser[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  nextPage: () => void;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
  setUsersData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
};

export const useFetchUsers: TUseFetchUsers = (query) => {
  const [usersData, setUsersData] = useState<IFullUser[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { page, totalPages, nextPage, goToPage } = usePagination(
    PER_PAGE,
    totalUsersCount
  );

  useEffect(() => {
    setUsersData([]);
    console.log(query.length, 'query.length');
    // console.log(totalUsersCount, 'totalUsersCount');
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
    // setUsersData([]);
    try {
      const data = await getUsersData(query, page);
      const additionalData = await getAdditionalUsersData(data.items);

      setUsersData((prev) => {
        if (additionalData.length) {
          return [...prev, ...additionalData];
        }
        return prev;
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

  // useEffect(() => {
  //   // console.log(query.length, 'query.length');
  //   // if (!query.length) {
  //   //   setUsersData([]);
  //   //   setTotalUsersCount(0);
  //   //   console.log(0, '23423');
  //   // }
  //   // if (query.length <= 1) {
  //   //   setUsersData([]);
  //   //   setTotalUsersCount(0);
  //   //   console.log(0, '23423');
  //   // }

  //   setTotalUsersCount(0);
  //   setUsersData([]);
  // }, [query]);

  return {
    usersData,
    setUsersData,
    loading,
    error,
    nextPage,
    goToPage,
    page,
    totalPages,
  };
};
