import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { IItems } from '../../services/types';
import './SearchField.style.scss';

interface ISearchFieldProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setPage: any;
}

const SearchField = ({ setQuery, setPage }: ISearchFieldProps) => {
  const [inputValue, setValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue(value);
  };

  useEffect(() => {
    if (debouncedInputValue) {
      setQuery(debouncedInputValue);
    }
  }, [debouncedInputValue, inputValue, setPage, setQuery]);

  //   console.log(debouncedInputValue);

  return (
    <div className='SearchField'>
      <input
        className='SearchField-input'
        autoComplete='off'
        type='text'
        name='name'
        placeholder='Enter username'
        onChange={handleInputChange}
        value={inputValue}
      />
    </div>
  );
};

export default SearchField;
