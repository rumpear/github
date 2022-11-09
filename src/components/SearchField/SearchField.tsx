import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import './SearchField.style.scss';

interface ISearchFieldProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}

const SearchField = ({
  query,
  setQuery,
  goToPage,
  loading,
}: ISearchFieldProps) => {
  const [inputVal, setInputVal] = useState(query);
  const [debouncedInputVal] = useDebounce(inputVal, 700);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputVal(value);
  };

  // const test = useCallback((val) => debounce(fetch(val), 700), []);

  // useEffect(() => {
  //   if (inputVal.length >= 3) {
  //     test(inputVal);
  //   }
  // }, [inputVal]);

  useEffect(() => {
    const trimmedDebouncedInputVal = debouncedInputVal.trim();
    setQuery(trimmedDebouncedInputVal);
  }, [debouncedInputVal, setQuery]);

  useEffect(() => {
    if (query !== debouncedInputVal) {
      goToPage(1);
    }
  }, [debouncedInputVal, goToPage, query]);

  return (
    <div className='SearchField'>
      <input
        className='SearchField-input'
        autoComplete='off'
        type='text'
        name='name'
        placeholder='Enter username'
        onChange={handleInputChange}
        value={inputVal}
      />
      {loading && <p className='SearchField-loading'>Loading...</p>}
    </div>
  );
};

export default SearchField;
