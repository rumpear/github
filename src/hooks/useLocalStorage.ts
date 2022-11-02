import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type UseLocalStorage = <T>(
  key: string,
  defaultValue?: any
) => {
  localStorageData: T;
  setLocalStorageData: Dispatch<SetStateAction<T>>;
};

export const useLocalStorage: UseLocalStorage = (key, defaultValue) => {
  const ifLocalDataExist = localStorage.getItem(key);

  const getData = () => {
    return ifLocalDataExist ? JSON.parse(ifLocalDataExist) : defaultValue;
  };

  const setData = () => {
    return localStorage.setItem(key, JSON.stringify(localStorageData));
  };

  const [localStorageData, setLocalStorageData] = useState(getData);
  useEffect(setData, [key, localStorageData]);

  return { localStorageData, setLocalStorageData };
};
