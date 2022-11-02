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

  const getData = () => {
    return ifLocalDataExist ? JSON.parse(ifLocalDataExist) : defaultValue;
  };

  const setData = () => {
    return localStorage.setItem(key, JSON.stringify(localStorageData));
  };

  const [localStorageData, setLocalStorageData] = useState<T>(getData);
  useEffect(setData, [key, localStorageData]);

  return { localStorageData, setLocalStorageData };
};
