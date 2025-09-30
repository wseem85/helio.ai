// components/CompleteLocalizedPricingTable.jsx
import React from 'react';
import { PricingTable } from '@clerk/clerk-react';
import useLanguage from '../hooks/useLanguage';
import { Loader2 } from 'lucide-react';
const CompleteLocalizedPricingTable = () => {
  return <PricingTable fallback={<PricingSkeleton />} />;
};

export default CompleteLocalizedPricingTable;

const PricingSkeleton = () => {
  const { currentLanguage } = useLanguage();
  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Loading text */}
      <div className="text-center">
        <div className="inline-flex items-center text-white/60 mb-4">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          {currentLanguage === 'ar'
            ? 'جاري تحميل الخطط...'
            : 'Loading plans...'}
        </div>
      </div>

      {/* Skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {[1, 2].map((i) => (
          <div
            key={i}
            className={`
            bg-gray-800 rounded-xl p-6 border-2 transition-all duration-300
            ${i === 2 ? 'border-blue-500 scale-105' : 'border-gray-700'}
          `}
          >
            {/* Popular badge skeleton */}

            {/* Plan title skeleton */}
            <div className="text-center mb-4">
              <div className="h-7 bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Price skeleton */}
            <div className="text-center mb-4">
              <div className="h-10 bg-gray-700 rounded w-1/3 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Features skeleton */}
            <div className="space-y-3 mb-6">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center">
                  <div className="h-5 w-5 bg-gray-700 rounded-full mr-3"></div>
                  <div className="h-4 bg-gray-700 rounded flex-1"></div>
                </div>
              ))}
            </div>

            {/* Button skeleton */}
            <div className="h-12 bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
