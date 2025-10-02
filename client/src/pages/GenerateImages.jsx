import { Image, Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { Helmet } from 'react-helmet';

const imageStyles = [
  {
    text: 'Realistic',
    textAr: 'واقعي',
  },
  {
    text: 'Ghibli style',
    textAr: 'غيبلي',
  },
  {
    text: 'Anime style',
    textAr: 'أنمي',
  },
  {
    text: 'Cartoon style',
    textAr: 'كارتون',
  },
  {
    text: 'Fantasy style',
    textAr: 'فانتازي',
  },
  {
    text: '3D style',
    textAr: 'ثلاثي الأبعاد',
  },
  {
    text: 'Portrait style',
    textAr: 'بورتريه',
  },
];

const GenerateImages = () => {
  const [style, setStyle] = useState('Realistic');
  const [imageDescription, setImageDescription] = useState('');
  const [publish, setPublish] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerating, setErrorGenerating] = useState('');
  const [response, setResponse] = useState('');
  const { getToken } = useAuth();
  const { t, isRTL } = useLanguage();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    try {
      if (!imageDescription || imageDescription.length < 10) {
        toast.error(
          'Please provide a detailed description (at least 10 characters)'
        );
        return;
      }
      setResponse('');
      setErrorGenerating('');
      setIsGenerating(true);

      const token = await getToken();
      const { data } = await axios.post(
        BACKEND_URL + '/api/ai/generate-image',
        {
          prompt: imageDescription,
          style: style,
          publish: publish,
          language: isRTL ? 'Arabic' : 'English',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === 'success') {
        setResponse(data.content);
      }
    } catch (err) {
      console.log(err);
      if (err.response?.data?.message) {
        setErrorGenerating(err.response.data.message);
      } else {
        setErrorGenerating(err.message);
      }
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {' '}
      <Helmet>
        <title>{t('seoContent.generateImage.title')}</title>
        <meta
          name="description"
          content={t('seoContent.generateImage.description')}
        />
      </Helmet>
      <div className="px-4 md:px-6 py-6">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="w-full xl:w-1/2">
            <form
              className="h-full xl:h-[700px] p-6 bg-black-light rounded-xl border border-white/20 
            shadow-lg shadow-black/20 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-brand" />
                <h1 className="text-xl font-semibold">
                  {t('generateImage.title')}
                </h1>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('generateImage.keywords')}
                  </label>
                  <textarea
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)}
                    rows={4}
                    className="w-full p-3 outline-none text-sm rounded-lg 
                    border border-white/30 bg-black-medium/50
                    focus:border-brand focus:ring-1 focus:ring-brand/20
                    resize-none transition-all duration-200"
                    placeholder={`${
                      isRTL
                        ? 'صِف الصورة التي تريد توليدها...'
                        : 'Describe the image you want to generate...'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    {t('generateImage.category')}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {imageStyles.map((el, index) => (
                      <button
                        type="button"
                        onClick={() => setStyle(el.text)}
                        className={`text-xs p-3 rounded-full border transition-all duration-200
                        ${
                          style === el.text
                            ? 'bg-brand border-brand text-white shadow-lg shadow-brand/25'
                            : 'bg-black-medium/50 border-white/30 hover:border-brand/50 hover:bg-black-medium'
                        }`}
                        key={index}
                      >
                        {isRTL ? el.textAr : el.text}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label htmlFor="toggle" className="relative cursor-pointer">
                    <input
                      type="checkbox"
                      id="toggle"
                      onChange={(e) => setPublish(e.target.checked)}
                      checked={publish}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-black-dark rounded-full peer-checked:bg-brand transition-colors"></div>
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
                  </label>
                  <p className="text-sm">
                    {isRTL
                      ? 'شارك الصورة مع مجتمعنا'
                      : 'Make this image public'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={imageDescription.length < 10 || isGenerating}
                className="w-full flex justify-center items-center gap-2 
                px-4 py-3 mt-6 text-sm font-medium
                bg-gradient-to-r from-[#20C363] to-[#099c69]
                disabled:cursor-not-allowed disabled:opacity-60
                rounded-lg text-white transition-all duration-200
                shadow-lg hover:shadow-xl hover:shadow-brand/25"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Image className="w-4 h-4" />
                )}
                {isGenerating
                  ? isRTL
                    ? 'جاري إنشاء الصورة...'
                    : 'Generating Image...'
                  : t('generateImage.btn')}
              </button>

              {errorGenerating && (
                <p className="text-red-400 mt-3 text-center px-4 py-2 text-sm">
                  {errorGenerating}
                </p>
              )}
            </form>
          </div>

          {/* Results Section */}
          <div className="w-full xl:w-1/2">
            <div
              className="h-full xl:h-[700px] p-6 bg-black-light rounded-xl border border-white/20 
            shadow-lg shadow-black/20 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <Image className="w-5 h-5 text-brand" />
                <h1 className="text-xl font-semibold">
                  {t('generateImage.result')}
                </h1>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                {!response ? (
                  <div className="flex-1 flex justify-center items-center">
                    {isGenerating ? (
                      <div className="text-center space-y-4">
                        <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
                        <p className="text-sm text-gray-400">
                          {isRTL
                            ? 'جاري إنشاء الصورة...'
                            : 'Generating your image...'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
                          <Image className="w-8 h-8 text-brand" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">
                            {isRTL
                              ? 'ابدأ في إنشاء صورتك'
                              : 'Start Creating Your Image'}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {isRTL
                              ? 'صِف الصورة، اختر النمط ثم انقر على "إنشاء صورة"'
                              : 'Describe the image, choose a style, then click "Generate Image"'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex justify-center items-center">
                    <div className="max-w-full max-h-full">
                      <img
                        src={response}
                        alt="Generated Image"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateImages;
