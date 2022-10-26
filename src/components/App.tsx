import { useCallback, useEffect, useState } from 'react';
import { useFetch, useFetchUsers } from '../hooks';
import { getUsersData } from '../services/githubApi';
import { IItems } from '../services/types';
import { SearchField, CardsList } from './';
import './App.style.scss';

function App() {
  const [query, setQuery] = useState('');
  // const [page, setPage] = useState(1);
  const [data, setData] = useState<IItems[]>([]);

  const { users, loading, error, setPage } = useFetchUsers(query);

  const handlePageChange = (): void => {
    setPage((prev) => prev + 1);
  };

  console.log(data, 'data');
  useEffect(() => {
    if (users?.items.length) {
      setData((prev: IItems[]) => {
        return [...prev, ...users?.items];
      });
    }
  }, [users?.items]);
  const usersData = users?.items;
  const isUsersEmpty = !usersData?.length;
  const isReadyToRender = !loading && !error && !isUsersEmpty;

  return (
    <div className='App'>
      <div className='SearchField-wrapper'>
        <SearchField setQuery={setQuery} setPage={() => {}} />
      </div>
      {!isUsersEmpty && <CardsList users={data} />}
      {/* {loading && <h1>Loading</h1>}
      {!loading && error && <h1>Something went wrong</h1>}
      {!loading && isUsersEmpty && <h1>Nothing was found in your request</h1>}
      {isReadyToRender && <CardsList users={data} />} */}

      <button type='button' onClick={handlePageChange}>
        Next page
      </button>
    </div>
  );
}

export default App;
