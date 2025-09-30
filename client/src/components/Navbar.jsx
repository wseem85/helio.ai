import React, { useEffect, useState, useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import useLanguage from '../hooks/useLanguage';
import SignInWrapper from './SignInWrapper';
import { Menu, PanelRight, PanelRightOpen, SquareMenu, X } from 'lucide-react';
import { useClerk, UserButton, useUser, SignIn } from '@clerk/clerk-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();

  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignInLoaded, setIsSignInLoaded] = useState(false);

  // Reset loaded state when modal closes
  useEffect(() => {
    if (!showSignIn) {
      setIsSignInLoaded(false);
    }
  }, [showSignIn]);

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-30 
          flex justify-between items-center
          px-4 md:px-6 lg:px-8
          h-16 md:h-20
          bg-black-medium/95 backdrop-blur-sm
          border-b border-white/10
          transition-all duration-300 ease-in-out`}
      >
        <p
          onClick={() => navigate('/')}
          className="text-sm md:text-base font-semibold tracking-wider cursor-pointer 
            hover:text-brand transition-colors duration-200"
        >
          HELIO.ai
        </p>

        <div className="flex items-center gap-3 md:gap-4">
          {!user ? (
            <button
              onClick={() => setShowSignIn(true)}
              className="bg-brand hover:bg-brand-dark cursor-pointer 
                text-white text-xs md:text-sm 
                px-4 py-2 md:px-5 md:py-2.5 
                rounded-xl outline-none 
                transition-all duration-200 
                hover:shadow-lg hover:shadow-brand/25"
            >
              {t('auth.login')}
            </button>
          ) : (
            <UserButton />
          )}
          <LanguageSwitcher />
        </div>
      </div>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 
          flex items-center justify-center p-4"
        >
          <div className="relative">
            {/* Show close button only after SignIn is loaded */}
            {isSignInLoaded && (
              <button
                className="absolute -top-12 right-0 p-2 
                  bg-gray-800 hover:bg-gray-700 
                  rounded-full transition-colors z-10"
                onClick={() => setShowSignIn(false)}
              >
                <X size={16} color="white" />
              </button>
            )}

            {/* Custom SignIn wrapper that tracks loading state */}
            <SignInWrapper
              onLoaded={() => setIsSignInLoaded(true)}
              onSuccess={() => setShowSignIn(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
