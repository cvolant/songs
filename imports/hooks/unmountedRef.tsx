import { useRef, useEffect, MutableRefObject } from 'react';

export const useUnmountedRef = (): MutableRefObject<boolean> => {
  const unmountedRef = useRef(false);

  useEffect(() => (): void => {
    unmountedRef.current = true;
  }, []);

  return unmountedRef;
};

export default useUnmountedRef;
