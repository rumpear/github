import { useState } from 'react';
import { ISearchFieldProps, THandleInputChange } from './types';
import './SearchField.style.scss';

const SearchField = ({ query, setQuery, loading }: ISearchFieldProps) => {
  const [inputVal, setInputVal] = useState(query);

  const handleInputChange: THandleInputChange = (e) => {
    const { value } = e.target;
    setInputVal(value);

    const trimmedValue = value.trim();
    setQuery(trimmedValue);
  };

  return (
    <div className='SearchField'>
      <input
        className='SearchField-input'
        autoComplete='off'
        type='text'
        name='name'
        placeholder='Enter username (at least 3 symbols)'
        onChange={handleInputChange}
        value={inputVal}
      />

      {loading && <p className='SearchField-loading'>Loading...</p>}
    </div>
  );
};

export default SearchField;
