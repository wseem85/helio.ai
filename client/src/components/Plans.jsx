import React from 'react';
import useLanguage from '../hooks/useLanguage';
import { PricingTable } from '@clerk/clerk-react';
import CompleteLocalizedPricingTable from './CompleteLocalizedPricingTable';

const Plans = () => {
  const { t } = useLanguage();

  return (
    <div className=" my-16 text-center space-y-2 mx-4 min-h-[400px]">
      <h2 className="text-2xl text-center tracking-wider leading-relaxed">
        {t('plans.title')}
      </h2>
      <p className="text-white/80 tracking-wide text-center">
        {t('plans.desc')}
      </p>
      <div className="max-w-3xl mx-auto mt-6">
        <CompleteLocalizedPricingTable />
      </div>
    </div>
  );
};

export default Plans;
