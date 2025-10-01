import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '../hooks/useLanguage';
import { assets } from '../assets/assets';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';

const Hero = () => {
  const navigate = useNavigate();
  const { isRTL, t } = useLanguage();
  const { user } = useUser();
  return (
    <div className="relative  bg-[url(/hero.png)] min-h-screen   md:justify-center  flex flex-col  gap-6 px-4 md-px-12 ">
      <h2 className="text-2xl md:text-4xl pt-48 md:pt-0 text-center tracking-wider">
        {t('hero.titlePartOne')}
        <span className="text-brand">{t('hero.titlePartTwo')}</span>{' '}
        {t('hero.titlePartThree')}
      </h2>
      <p className="text-center text-lg md:text-xl font-light leading-relaxed">
        {' '}
        {t('hero.subTitleOne')} <br />
        <span className="text-xl text-brand tracking-widest font-medium uppercase">
          {' '}
          Helio.ai{' '}
        </span>
        {t('hero.subTitleTwo')}
      </p>
      <button
        className="text-xl bg-brand hover:bg-brand-dark transition-all duration-200 cursor-pointer px-6 py-3 rounded-xl max-w-[200px] mx-auto text-white"
        onClick={() => {
          if (!user) {
            toast.warning('You need to log in n order to use our tools');
          } else navigate('/ai');
        }}
      >
        {t('common.start')}
      </button>
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-1">
        <img className="w-28" src={assets.user_group} alt="group of users" />
        <p>{t('hero.groupUsersText')}</p>
      </div>
    </div>
  );
};

export default Hero;
