import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { IFullUser } from '../../services/types';
import './SearchField.style.scss';

interface ISearchFieldProps {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
  setUsersData: React.Dispatch<React.SetStateAction<IFullUser[]>>;
}

const SearchField = ({
  setQuery,
  goToPage,
  setUsersData,
}: ISearchFieldProps) => {
  const [inputVal, setInputVal] = useState('');
  const [debouncedInputVal] = useDebounce(inputVal, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputVal(value);
  };

  useEffect(() => {
    setQuery(debouncedInputVal);
    goToPage(1);
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
