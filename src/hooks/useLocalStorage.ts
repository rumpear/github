import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type TUseLocalStorage = <T, D>(
  key: string,
  defaultValue?: D
) => {
  localStorageData: T;
  setLocalStorageData: Dispatch<SetStateAction<T>>;
};

export const useLocalStorage: TUseLocalStorage = <T, D>(
  key: string,
  defaultValue?: D
) => {
  const ifLocalDataExist = localStorage.getItem(key);

  // try catch JSON.parse
  const getData = () => {
    return ifLocalDataExist ? JSON.parse(ifLocalDataExist) : defaultValue;
  };

  // try catch JSON.parse
  const setData = () => {
    return localStorage.setItem(key, JSON.stringify(localStorageData));
  };

  const [localStorageData, setLocalStorageData] = useState<T>(getData());
  useEffect(setData, [key, localStorageData]);

  return { localStorageData, setLocalStorageData };
};
