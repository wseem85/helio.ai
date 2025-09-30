# The Client

### 1. Setting the App

- create react app with vite

```
npm create vite@latest
```

name it client

```
cd client
```

- install dependencies

```
npm i
```

- install react router dom

```
npm i react-router-dom
```

- install package for icons

```
npm i lucide-react
```

- start

```
npm run dev
```

- and clean up : deleta App.css , change favicon , clear App.jsx

- install tailwindcss

```
npm install tailwindcss @tailwindcss/vite
```

- set up tailwind css

```
vite.config.js
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

```
index.css
// import google fonts
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
// import tailwind
@import "tailwindcss";
// setting global rules
body {
  font-family: 'Outfit', sans-serif;
  background-color: #1e1e1e;
}
// or setting an app theme
@theme {
  --color-brand: #ffc3eb;
}
```

start using it

### 2. Setting i18next package for multi-languages app

### A:Install

```
npm install react-i18next i18next i18next-browser-languagedetector i18next-http-backend
```

- **react-i18next** : The core engine

  - provides the core internatonalization functionalities
  - handles translation loading , interpolations `Hello, {{name}}!`, plurals `{{count}} item vs {{count}} items` and formatting (dates,currencies ,..)
  - managing languages switching

- **react-i18next** : React Integration with i18next

  - provides a few hooks `useTranslation` and components `<Translation/>` ready to use
  - handles re-renders when language changes
  - built in loading states

- **i18next-browser-languagedetector** : to detect and remember user preferencies about language

- **i18next-http-backend** : you need it on production it loades translation files from server which minimize the js bundle and offers a lazy loading , you can change translations without redeploying your app

### B:Structure

src/
├── i18n/
│ ├── index.js
│ ├── locales/
│ │ ├── en/
│ │ │ └── common.json
│ │ └── ar/
│ │ └── common.json
├── hooks/
│ └── useLanguage.js
├── components/
│ └── LanguageSwitcher.jsx
└── contexts/
└── LanguageContext.jsx
