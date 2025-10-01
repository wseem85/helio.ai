import React from 'react';
import LanguageSwitcher from './components/LanguageSwitcher.jsx';

import { Route, Routes } from 'react-router-dom';
// Import i18n configuration
// import Home from './pages/Home.jsx';
import Layout from './pages/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GenerateArticle from './pages/GenerateArticle.jsx';
import SimplifyIdea from './pages/SimplifyIdea.jsx';
import GenerateImages from './pages/GenerateImages.jsx';
import RemoveBackground from './pages/RemoveBackground.jsx';

import AnalayseResume from './pages/AnalayseResume.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/Navbar.jsx';
import SideBar from './components/Sidebar.jsx';
import useLanguage from './hooks/useLanguage.js';
import { ToastContainer } from 'react-toastify';
import Community from './pages/Community.jsx';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import ContentTransformer from './pages/ContentTransformer.jsx';
const App = () => {
  // const { getToken } = useAuth();
  // useEffect(() => {
  //   getToken().then((t) => console.log(t));
  // });
  const { isRTL } = useLanguage();
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={isRTL}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/ai" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="generate-article" element={<GenerateArticle />} />
          <Route path="simplify-idea" element={<SimplifyIdea />} />
          <Route path="generate-image" element={<GenerateImages />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="content-transformer" element={<ContentTransformer />} />
          <Route path="analayse-resume" element={<AnalayseResume />} />
          <Route path="community" element={<Community />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
