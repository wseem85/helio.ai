import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import useLanguage from '../hooks/useLanguage';

const Layout = () => {
  const { isRTL, getFlexDirection } = useLanguage();
  return (
    <div className="min-h-screen bg-black-dark">
      <Navbar />
      <SideBar />
      <div
        className={`relative px-3 sm:px-4 lg:px-6 min-h-screen transition-all duration-300 ease-in-out
          pt-16 md:pt-20 
          ${isRTL ? 'md:mr-60 xl:mr-64' : 'md:ml-60 xl:ml-64'} 
          ${getFlexDirection()}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
