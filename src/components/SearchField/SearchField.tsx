import { memo, useState } from 'react';
import { MESSAGES_LABELS } from '../../constants';
import { ISearchFieldProps, THandleInputChange } from './types';
import './SearchField.scss';

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
        placeholder={MESSAGES_LABELS.searchMessage}
        onChange={handleInputChange}
        value={inputVal}
      />

      {loading && (
        <p className='SearchField-loading'>{MESSAGES_LABELS.loading}</p>
      )}
    </div>
  );
};

export default memo(SearchField);
