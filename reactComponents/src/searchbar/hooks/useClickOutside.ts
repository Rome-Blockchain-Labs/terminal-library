import { useRef, useEffect } from 'react';

const useClickOutside = (callback) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    function onClick(event) {
      if (ref && ref.current && !ref.current?.contains(event.target)) {
        callback(event);
      }
    }

    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  return ref;
};

export default useClickOutside;
