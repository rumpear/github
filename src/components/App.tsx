import { useEffect, useState } from 'react';
import { useFetchUsers } from '../hooks';
import { SearchField, CardsList } from './';
import './App.style.scss';

function App() {
  const [query, setQuery] = useState('');

  const {
    usersData,
    setUsersData,
    loading,
    error,
    nextPage,
    goToPage,
    page,
    totalPages,
  } = useFetchUsers(query);

  // const usersData = users?.items;
  // const isUsersEmpty = !usersData?.length;
  // const isReadyToRender = !loading && !error && !isUsersEmpty;

  return (
    <div className='App'>
      <div className='SearchField-wrapper'>
        <SearchField setQuery={setQuery} goToPage={goToPage} />
      </div>
      {!!usersData?.length && (
        <CardsList
          users={usersData}
          nextPage={nextPage}
          totalPages={totalPages}
          loading={loading}
          page={page}
        />
      )}
      {/* {loading && <h1>Loading</h1>}
      {!loading && error && <h1>Something went wrong</h1>}
      {!loading && isUsersEmpty && <h1>Nothing was found in your request</h1>}
      {isReadyToRender && <CardsList users={data} />} */}
    </div>
  );
}

export default App;
