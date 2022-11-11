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
  const localData = localStorage.getItem(key);
  const getData = () => {
    if (!localData) {
      return defaultValue;
    }

    try {
      return JSON.parse(localData);
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }
  };

  const setData = () => {
    localStorage.setItem(key, JSON.stringify(localStorageData));
  };

  const [localStorageData, setLocalStorageData] = useState<T>(getData);
  useEffect(setData, [key, localStorageData]);

  return { localStorageData, setLocalStorageData };
};
