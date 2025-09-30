import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import ClerkLocalizedApp from './components/ClerkLocalizationapp.jsx';
import './i18n/index.js';

// Create a wrapper component that handles localization
// function ClerkLocalizedApp() {
//   const { currentLanguage } = useLanguage(); // Make sure you can access i18n here

//   const getClerkLocalization = () => {
//     switch (currentLanguage) {
//       case 'ar':
//         return arSA;
//       case 'en':
//       default:
//         return enUS;
//     }
//   };

//   return (
//     <ClerkProvider
//       publishableKey={PUBLISHABLE_KEY}
//       appearance={{
//         baseTheme: dark,
//       }}
//       localization={getClerkLocalization()} // Dynamic localization
//     >
//       <App />
//     </ClerkProvider>
//   );
// }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <ClerkLocalizedApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkLocalizedApp>
    </LanguageProvider>
  </StrictMode>
);
