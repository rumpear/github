import { useCallback, useEffect, useState } from 'react';

type TUseFetch = <T>(
  requestFn: () => Promise<T>,
  deps: any[]
) => {
  state: T | null;
  loading: boolean;
  error: string;
};

export const useFetch: TUseFetch = <T>(
  requestFn: () => Promise<T>,
  deps: any[]
) => {
  const [state, setState] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const asyncRequest = useCallback(async () => {
    setLoading(true);
    try {
      const data = await requestFn();
      setState(data);
    } catch (error) {
      const e = error as Error;
      setError(e.message);
    }

    setLoading(false);
  }, [requestFn]);

  useEffect(() => {
    asyncRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { state, loading, error };
};
