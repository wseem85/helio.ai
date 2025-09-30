import { SignIn, useSignIn, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SignInWrapper from './SignInWrapper';
import {} from '@clerk/clerk-react';
import { X } from 'lucide-react';
const ToolBox = ({ title, description, path, children }) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignInLoaded, setIsSignInLoaded] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();
  const handleClick = () => {
    if (!user) {
      toast.error('You need to log in in order to access our tools');
      setShowSignIn(true);
    } else {
      navigate(path);
      scrollTo(0, 0);
    }
  };
  useEffect(() => {
    if (!showSignIn) {
      setIsSignInLoaded(false);
    }
  }, [showSignIn]);
  return (
    <>
      <div
        onClick={handleClick}
        className="px-6 max-w-[360px] cursor-pointer  py-14 flex gap-4 shadow-md shadow-white/30 flex-col hover:translate-y-1.5 transition-all duration-150"
      >
        <div className="flex items-center gap-5">
          {children}

          <h4 className="text-lg tracking-wide">{title}</h4>
        </div>
        <div className="text-white/70">{description}</div>
      </div>
      {showSignIn && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative">
            {/* Show close button only after SignIn is loaded */}
            {isSignInLoaded && (
              <button
                className="absolute -top-10 right-0 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors z-10"
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

export default ToolBox;
