import { Globe, Smartphone } from 'lucide-react';
import React from 'react';
import useLanguage from '../hooks/useLanguage';

const Footer = () => {
  const { t, isRTL } = useLanguage();
  return (
    <div className="py-10 text-sm px-6 bg-black-light flex  ">
      <div className="flex flex-1  flex-col gap-3">
        <p className="text-center">
          {t('footer.copyRightsOne')}-{t('footer.copyRightsTwo')}
          &copy;
          <span className="text-brand-dark text-base ps-2 font-bold">
            Helio.ai- {new Date().getFullYear()}
          </span>
          .
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2  place-items-center gap-4">
          <p className="flex gap-1 items-center">
            {t('footer.otherProjects')}
            <a
              href="https://wseemkharma.vercel.app/projects"
              target="_blank"
              className="text-brand-dark text-base font-bold ml-2 flex items-center gap-1 underline"
            >
              {' '}
              <Globe className="w-4 h-w text-brand-dark ms-2 me-1" />
              Other Projects
            </a>
          </p>
          <p className="flex gap-1 items-center">
            {t('footer.callMe')}
            <Smartphone className="w-4 h-w text-brand-dark  ms-2 me-1" />
            <span className="text-brand-dark font-bold text-base tracking-wide">
              0994875398
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
