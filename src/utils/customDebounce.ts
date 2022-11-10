type TCustomDebounce = <A>(
  cb: Function,
  time: number
) => (...args: A[]) => void;

export const customDebounce: TCustomDebounce = <A>(
  cb: Function,
  time: number
) => {
  let timerId: string | number | NodeJS.Timeout | null | undefined = null;

  const debounce = (...args: A[]) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => cb(...args), time);
  };

  return debounce;
};
