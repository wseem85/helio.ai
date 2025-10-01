import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import useLanguage from '../hooks/useLanguage';
import { Protect } from '@clerk/clerk-react';

const Layout = () => {
  const { isRTL, getFlexDirection } = useLanguage();
  return (
    <div className="min-h-screen bg-black-dark pb-12">
      <Navbar />
      <SideBar />
      <Protect
        fallback={
          <p className="text-white min-h-screen text-2xl px-8 text-center flex justify-center items-center">
            {isRTL
              ? 'عذرًا،  يرجى تسجيل الدخول الوصول إلى هذا المحتوى.'
              : 'Sorry, only Login users can access this content, Please login to continue.'}
          </p>
        }
      >
        <div
          className={`relative px-3 sm:px-4 lg:px-6 min-h-screen transition-all duration-300 ease-in-out
          pt-16 md:pt-20 
          ${isRTL ? 'md:mr-60 xl:mr-64' : 'md:ml-60 xl:ml-64'} 
          ${getFlexDirection()}`}
        >
          <Outlet />
        </div>
      </Protect>
    </div>
  );
};

export default Layout;
