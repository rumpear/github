import { useCallback, useEffect, useState } from 'react';
import { getUsersData } from '../services/githubApi';
import { IResponse } from '../services/types';

const MINIMAL_QUERY_LENGTH = 3;

type TUseFetchUsers = (
  query: string
  //   page: number
) => {
  users: IResponse | null;
  loading: boolean;
  error: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const useFetchUsers: TUseFetchUsers = (query = '') => {
  const [users, setUsers] = useState<IResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    const isQueryLessThanReqLength = query.length < MINIMAL_QUERY_LENGTH;

    if (!query || isQueryLessThanReqLength) {
      return;
    }

    setLoading(true);
    try {
      const data = await getUsersData(query, page);
      setUsers(data);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    }
    setLoading(false);
  }, [query, page]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { users, loading, error, setPage };
};
