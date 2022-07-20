import { useMediaQuery } from 'react-responsive';

export const useIsMobile = (): boolean => {
  return useMediaQuery({
    maxWidth: 768
  });
};