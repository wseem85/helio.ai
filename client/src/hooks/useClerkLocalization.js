import { enUS, arSA } from '@clerk/localizations';
import useLanguage from './useLanguage';

export const useClerkLocalization = () => {
  const { currentLanguage } = useLanguage();

  const getClerkLocalization = () => {
    switch (currentLanguage) {
      case 'ar':
        return arSA;
      case 'en':
      default:
        return enUS;
    }
  };

  return getClerkLocalization();
};
