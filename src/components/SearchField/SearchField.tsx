import { useState } from 'react';
import './SearchField.style.scss';
interface ISearchFieldProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}

const SearchField = ({ query, setQuery, loading }: ISearchFieldProps) => {
  const [inputVal, setInputVal] = useState(query);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        placeholder='Enter username'
        onChange={handleInputChange}
        value={inputVal}
      />
      {loading && <p className='SearchField-loading'>Loading...</p>}
    </div>
  );
};

export default SearchField;

// * v1
// import { useCallback, useEffect, useState } from 'react';
// import { useDebounce } from 'use-debounce';
// import './SearchField.style.scss';

// interface ISearchFieldProps {
//   query: string;
//   setQuery: React.Dispatch<React.SetStateAction<string>>;
//   goToPage: React.Dispatch<React.SetStateAction<number>>;
//   loading: boolean;
// }

// const SearchField = ({
//   query,
//   setQuery,
//   goToPage,
//   loading,
// }: ISearchFieldProps) => {
//   const [inputVal, setInputVal] = useState(query);
//   const [debouncedInputVal] = useDebounce(inputVal, 700);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setInputVal(value);
//   };

//   // const test = useCallback((val) => debounce(fetch(val), 700), []);

//   // useEffect(() => {
//   //   if (inputVal.length >= 3) {
//   //     test(inputVal);
//   //   }
//   // }, [inputVal]);

//   useEffect(() => {
//     const trimmedDebouncedInputVal = debouncedInputVal.trim();
//     setQuery(trimmedDebouncedInputVal);
//   }, [debouncedInputVal, setQuery]);

//   useEffect(() => {
//     if (query !== debouncedInputVal) {
//       goToPage(1);
//     }
//   }, [debouncedInputVal, goToPage, query]);

//   return (
//     <div className='SearchField'>
//       <input
//         className='SearchField-input'
//         autoComplete='off'
//         type='text'
//         name='name'
//         placeholder='Enter username'
//         onChange={handleInputChange}
//         value={inputVal}
//       />
//       {loading && <p className='SearchField-loading'>Loading...</p>}
//     </div>
//   );
// };

// export default SearchField;

// // * v2
// import { useCallback, useEffect, useState } from 'react';
// import debounce from 'lodash.debounce';
// import { QUERY_DEBOUNCE_TIME } from '../../constants';
// import './SearchField.style.scss';
// import { useDebounce } from 'use-debounce';
// interface ISearchFieldProps {
//   query: string;
//   setQuery: React.Dispatch<React.SetStateAction<string>>;
//   loading: boolean;
// }

// const SearchField = ({ query, setQuery, loading }: ISearchFieldProps) => {
//   const [inputVal, setInputVal] = useState(query);
//   // const setQueryDebounced = debounce(setQuery, 3000);
//   // const [debouncedInputVal] = useDebounce(inputVal, 700);
//   // const [uSetQuery] = useDebounce(setQuery, 700);

//   // const setInputValDebounced = debounce(setInputVal, QUERY_DEBOUNCE_TIME);
//   // const debouncedChangeHandler = useCallback(debounce(setQuery, 700), []);
//   console.log(query, 'query');

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     // setInputValDebounced(value);
//     setInputVal(value);
//     // console.log(345);
//     const trimmedValue = value.trim();
//     // setQueryDebounced(value);
//     // uSetQuery(trimmedValue);
//     // setQuery(value);
//     setQuery(trimmedValue);
//     // debouncedChangeHandler(trimmedValue);
//     // setQuery(debouncedInputVal);
//   };

//   // const handleInputChange = debounce(handleInputChange1, 700);
//   // const [handleInputChange] = useDebounce(handleInputChange1, 700);
//   // useEffect(() => {
//   //   const trimmedValue = inputVal.trim();
//   //   setQueryDebounced(trimmedValue);
//   // }, [inputVal, setQueryDebounced]);

//   // useEffect(() => {
//   //   const trimmedDebouncedInputVal = debouncedInputVal.trim();
//   //   setQueryDebounced(trimmedDebouncedInputVal);
//   // }, [debouncedInputVal, setQueryDebounced]);

//   return (
//     <div className='SearchField'>
//       <input
//         className='SearchField-input'
//         autoComplete='off'
//         type='text'
//         name='name'
//         placeholder='Enter username'
//         onChange={handleInputChange}
//         value={inputVal}
//       />
//       {loading && <p className='SearchField-loading'>Loading...</p>}
//     </div>
//   );
// };

// export default SearchField;
