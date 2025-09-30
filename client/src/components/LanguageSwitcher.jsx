// svg
// 	 <svg
// 	className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
// 	fill="none"
// 	stroke="currentColor"
// 	viewBox="0 0 24 24"
// >
// 	<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// </svg>

//svg

{
  /* <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
	<path
	fillRule="evenodd"
	d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
	clipRule="evenodd"
	/>
</svg> */
}
import { useState } from 'react';
import useLanguage from '../hooks/useLanguage';
const LanguageSwitcher = ({ variant = 'dropdown' }) => {
  const { t, currentLanguage, changeLanguage, isRTL, getFlexDirection } =
    useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];
  const currentLang = languages.find((lang) => lang.code === currentLanguage);
  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  if (variant === 'toggle') {
    return (
      <button
        onClick={() => changeLanguage(currentLanguage === 'en' ? 'ar' : 'en')}
        className={`flex items-center gap-2 px-2 py-0.5 rounded-lg bg-white/90 transition-all  duration-150 font-medium ${getFlexDirection()}`}
      >
        <span>{currentLang?.flag}</span>
        <span>{currentLang?.name}</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex outline-none border-none items-center gap-2   transition-all duration-150 font-light text-sm  ${getFlexDirection()} ${
          isRTL ? 'text-right' : 'text-left'
        }`}
      >
        <span>{currentLang?.flag}</span>
        <span className="flex-1">{currentLang?.name}</span>

        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          className={`absolute top-full w-[120px]  pt-2 px-2 left-0 bg-black-medium border-none  shadow-lg z-50 overflow-hidden ${
            isRTL ? 'left-0' : 'right-0'
          }`}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-2 py-1 text-sm font-light text-left hover:bg-black-light flex items-center gap-2 transition-colors duration-150  ${getFlexDirection()} ${
                isRTL ? 'text-right' : 'text-left'
              }`}
            >
              <span className="text-xs">{lang.flag}</span>
              <span className="flex-1 text-xs">{lang.name}</span>
              {currentLanguage === lang.code && (
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
