import { useState } from 'react';

type TUsePagination = (
  contentPerPage: number,
  totalCount: number
) => {
  page: number;
  totalPages: number;
  lastIdx: number;
  firstIdx: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: React.Dispatch<React.SetStateAction<number>>;
};

export const usePagination: TUsePagination = (contentPerPage, totalCount) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(totalCount / contentPerPage);
  const lastIdx = page * contentPerPage;
  const firstIdx = lastIdx - contentPerPage;

  const nextPage = () => {
    setPage((prev) => {
      if (prev === totalPages) {
        return prev;
      }
      return prev + 1;
    });
  };

  const prevPage = () => {
    setPage((prev) => {
      if (prev === 1) {
        return prev;
      }
      return prev - 1;
    });
  };

  return {
    page,
    totalPages,
    lastIdx,
    firstIdx,
    nextPage,
    prevPage,
    goToPage: setPage,
  };
};
