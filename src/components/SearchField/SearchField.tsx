import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import './SearchField.style.scss';

interface ISearchFieldProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
}

const SearchField = ({ setQuery, goToPage }: ISearchFieldProps) => {
  const [inputVal, setInputVal] = useState('');
  const [debouncedInputVal] = useDebounce(inputVal, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputVal(value);
  };

  useEffect(() => {
    if (debouncedInputVal) {
      setQuery(debouncedInputVal);
      goToPage(1);
    }
  }, [debouncedInputVal, goToPage, setQuery]);

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
    </div>
  );
};

export default SearchField;
