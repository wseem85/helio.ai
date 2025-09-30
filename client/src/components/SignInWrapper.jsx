import { useEffect, useRef, useState } from 'react';
import { SignIn } from '@clerk/clerk-react';
const SignInWrapper = ({ onLoaded, onSuccess }) => {
  const wrapperRef = useRef(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Check if Clerk's SignIn form has loaded by looking for specific elements
    const checkIfLoaded = () => {
      if (wrapperRef.current) {
        // Look for Clerk-specific elements that indicate the form is loaded
        const clerkElements = wrapperRef.current.querySelectorAll(
          '[class*="cl-"], [data-localization-key], form, input, button'
        );

        if (clerkElements.length > 0) {
          setHasLoaded(true);
          onLoaded();
        }
      }
    };

    // Check immediately and then periodically
    checkIfLoaded();
    const interval = setInterval(checkIfLoaded, 100);

    // Cleanup after 5 seconds max to prevent infinite checking
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setHasLoaded(true);
      onLoaded();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onLoaded]);

  return (
    <div ref={wrapperRef}>
      <SignIn
        fallback={<SignInFallback />}
        onSuccess={onSuccess}
        fallbackRedirectUrl="/ai"
      />
    </div>
  );
};

const SignInFallback = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
          <h3 className="text-white text-lg font-medium mb-2">
            Loading Sign In
          </h3>
          <p className="text-gray-400 text-sm">Preparing authentication...</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
          <div className="h-10 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SignInWrapper;
