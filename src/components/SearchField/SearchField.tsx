import { useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { useDebounce } from 'use-debounce';
import { MINIMAL_QUERY_LENGTH, QUERY_DEBOUNCE_TIME } from '../../constants';
import './SearchField.style.scss';
interface ISearchFieldProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const SearchField = ({ query, setQuery, loading }: ISearchFieldProps) => {
  const [inputVal, setInputVal] = useState(query);
  const [queryWarning, setQueryWarning] = useState('');
  const [debouncedQuery] = useDebounce(query, QUERY_DEBOUNCE_TIME);

  const setQueryWarningDebounced = useCallback(
    debounce(setQueryWarning, QUERY_DEBOUNCE_TIME),
    []
  );

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    setInputVal(value);

    const trimmedValue = value.trim();
    setQuery(trimmedValue);
    setQueryWarningDebounced(trimmedValue);
  };

  // const isShowQueryWarning = inputVal && inputVal.length < 3;
  const isShowQueryWarning =
    debouncedQuery && debouncedQuery.length < MINIMAL_QUERY_LENGTH && !loading;
  // const isShowQueryWarning = queryWarning && queryWarning.length < 3;

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
      {isShowQueryWarning && (
        <p className='SearchField-warning'>
          Query must have at least 3 symbols
        </p>
      )}
    </div>
  );
};

export default SearchField;
