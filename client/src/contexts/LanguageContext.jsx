import React, { useContext, createContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const LanguageContext = createContext();

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used only in LanguageProvider');
  }
  return context;
};

export const LanguageProvider = function ({ children }) {
  const { i18n } = useTranslation();
  console.log(i18n);
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const getDirection = () => {
    return isRTL ? 'rtl' : 'ltr';
  };
  const getTextAlign = () => {
    return isRTL ? 'text-right' : 'text-left';
  };
  const getFlexDirection = (reverse = false) => {
    if (reverse) {
      return isRTL ? 'flex-row' : 'flex-row-reverse';
    }
    return isRTL ? 'flex-row-reverse' : 'flex-row';
  };
  const getMargin = (side) => {
    const marginMap = {
      left: isRTL ? 'mr' : 'ml',
      right: isRTL ? 'ml' : 'mr',
      start: isRTL ? 'mr' : 'ml',
      end: isRTL ? 'ml' : 'mr',
    };
    return marginMap[side] || side;
  };
  const getPadding = (side) => {
    const paddingMap = {
      left: isRTL ? 'pr' : 'pl',
      right: isRTL ? 'pl' : 'pr',
      start: isRTL ? 'pr' : 'pl',
      end: isRTL ? 'pl' : 'pr',
    };
    return paddingMap[side] || side;
  };
  useEffect(() => {
    document.documentElement.dir = getDirection();
    document.documentElement.lang = currentLanguage;
    document.body.classList.toggle('rtl', isRTL);
    document.body.classList.toggle('ltr', !isRTL);
  }, [currentLanguage, isRTL]);
  const value = {
    currentLanguage,
    isRTL,
    getDirection,
    changeLanguage,
    getTextAlign,
    getFlexDirection,
    getMargin,
    getPadding,
    rtlClass: (ltrClass, rtlClass) => (isRTL ? rtlClass : ltrClass),
    dirClass: (classes) => (isRTL ? classes.rtl : classes.ltr),
  };
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
