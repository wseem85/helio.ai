import React from 'react';
import useLanguage from '../hooks/useLanguage';
export const Testimonial = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 my-16">
      <h2 className="text-3xl tracking-widest text-center">
        {t('testimonial.heading')}
      </h2>
      <p className="text-center text-white/80 mt-1">{t('testimonial.desc')}</p>
      <div className="flex flex-wrap items-center justify-center gap-6 py-6">
        <div className="relative border border-gray-200 rounded-lg overflow-hidden max-w-sm hover:shadow-lg transition-shadow duration-300 shadow-md shadow-white/20">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 ">
              <h3 className="text-lg font-semibold">
                {t('testimonial.userOne.headText')}
              </h3>
              <p className="my-4 text-sm text-white/60 line-clamp-3">
                {t('testimonial.userOne.message')}
              </p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <img
                className="rounded-full w-9 h-9"
                src={t('testimonial.userOne.image')}
                alt={`${t('testimonial.userOne.message')} profile`}
              />
              <div className="space-y-0.5 font-medium text-left me-3">
                <p> {t('testimonial.userOne.name')}</p>
                <p className="text-sm text-gray-500">
                  {' '}
                  {t('testimonial.userOne.title')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative border border-gray-200 rounded-lg overflow-hidden max-w-sm hover:shadow-lg transition-shadow duration-300 shadow-md shadow-white/20">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 ">
              <h3 className="text-lg font-semibold">
                {t('testimonial.userTwo.headText')}
              </h3>
              <p className="my-4 text-sm text-white/60 line-clamp-3">
                {t('testimonial.userTwo.message')}
              </p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <img
                className="rounded-full w-9 h-9"
                src={t('testimonial.userTwo.image')}
                alt={`${t('testimonial.userTwo.message')} profile`}
              />
              <div className="space-y-0.5 font-medium text-left me-3">
                <p> {t('testimonial.userTwo.name')}</p>
                <p className="text-sm text-gray-500">
                  {' '}
                  {t('testimonial.userTwo.title')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative border border-gray-200 rounded-lg overflow-hidden max-w-sm hover:shadow-lg transition-shadow duration-300 shadow-md shadow-white/20">
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 ">
              <h3 className="text-lg font-semibold">
                {t('testimonial.userThree.headText')}
              </h3>
              <p className="my-4 text-sm text-white/60 line-clamp-3">
                {t('testimonial.userThree.message')}
              </p>
            </div>
            <div className="flex gap-2 items-center justify-center">
              <img
                className="rounded-full w-9 h-9"
                src={t('testimonial.userThree.image')}
                alt={`${t('testimonial.userThree.message')} profile`}
              />
              <div className="space-y-0.5 font-medium text-left me-3">
                <p> {t('testimonial.userThree.name')}</p>
                <p className="text-sm text-gray-500">
                  {' '}
                  {t('testimonial.userThree.title')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
