import { useTranslation } from 'react-i18next';
import { useLanguageContext } from '../contexts/LanguageContext';

const useLanguage = () => {
  const { t } = useTranslation();
  const languageContext = useLanguageContext();
  return { t, ...languageContext };
};
export default useLanguage;
