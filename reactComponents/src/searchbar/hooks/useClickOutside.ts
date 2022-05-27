import React, { useRef, useEffect } from 'react';

type CallbackFunction = (e: React.SyntheticEvent) => void;

const useClickOutside = (callback: CallbackFunction): React.RefObject<HTMLElement> => {
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
