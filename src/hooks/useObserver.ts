import { useState, useEffect, useRef } from 'react';

type TObserverOptions = {
  root: null;
  rootMargin: string;
  threshold: number;
};

const observerOptions: TObserverOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 1,
};

type TUseObserver = (options?: TObserverOptions) => {
  containerRef: React.MutableRefObject<null>;
  isVisible: boolean;
};

export const useObserver: TUseObserver = (options = observerOptions) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const getEntries = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(getEntries, options);
    const currentContainerRef = containerRef.current;

    if (currentContainerRef) {
      observer.observe(currentContainerRef);
    }

    return () => {
      if (currentContainerRef) {
        observer.unobserve(currentContainerRef);
      }
    };
  }, [options]);

  return { containerRef, isVisible };
};
