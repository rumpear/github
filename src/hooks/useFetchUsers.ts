import { useCallback, useEffect, useState } from 'react';
import { getUsersData } from '../services/githubApi';
import { IItems } from '../services/types';
import { usePagination } from './';

const MINIMAL_QUERY_LENGTH = 3;
const PER_PAGE = 30;

type TUseFetchUsers = (query: string) => {
  usersData: IItems[];
  loading: boolean;
  error: string;
  page: number;
  totalPages: number;
  nextPage: () => void;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
};

export const useFetchUsers: TUseFetchUsers = (query) => {
  const [usersData, setUsersData] = useState<IItems[]>([]);
  const [totalUsersCount, setTotalUsersCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const { page, totalPages, nextPage, goToPage } = usePagination(
    PER_PAGE,
    totalUsersCount
  );

  const fetchData = useCallback(async () => {
    const isQueryLessThanReqLength = query.length < MINIMAL_QUERY_LENGTH;

    if (!query || isQueryLessThanReqLength) {
      return;
    }

    setLoading(true);
    try {
      const data = await getUsersData(query, page);

      setUsersData((prev) => {
        if (data.items.length) {
          return [...prev, ...data.items];
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

  useEffect(() => {
    setUsersData([]);
  }, [query]);

  return { usersData, loading, error, nextPage, goToPage, page, totalPages };
};
