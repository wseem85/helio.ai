import {
  Sparkles,
  Copy,
  Repeat2,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
  Music,
  Loader2,
} from 'lucide-react';

import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import useLanguage from '../hooks/useLanguage';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'markdown-to-jsx';

const ContentTransformer = () => {
  const [inputContent, setInputContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerating, setErrorGenerating] = useState('');
  const [generatedPost, setGeneratedPost] = useState({
    platform: '',
    text: '',
  });
  const { getToken } = useAuth();
  const { t, isRTL } = useLanguage();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      nameAr: 'إنستغرام',
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      nameAr: 'لينكدإن',
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      nameAr: 'فيسبوك',
      icon: <Facebook className="w-4 h-4" />,
    },
    {
      id: 'twitter',
      name: 'Twitter',
      nameAr: 'تويتر',
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      nameAr: 'تيك توك',
      icon: <Music className="w-4 h-4" />,
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!inputContent || !selectedPlatform) {
        toast.error('Please provide content and select at least one platform');
        return;
      }
      setGeneratedPost({
        platform: '',
        text: '',
      });
      setErrorGenerating('');
      setIsGenerating(true);

      const token = await getToken();
      4;

      const { data } = await axios.post(
        BACKEND_URL + '/api/ai/transform-content',
        {
          content: inputContent,
          platform: selectedPlatform,
          language: isRTL ? 'ar' : 'en',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      if (data.status === 'success') {
        console.log(data);
        setGeneratedPost({ platform: selectedPlatform, text: data.post });
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

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatform(platformId);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success(isRTL ? 'تم النسخ!' : 'Copied!');
  };

  return (
    <>
      <Helmet>
        <title>{t('seoContent.contentTransformer.title')}</title>
        <meta
          name="description"
          content={t('seoContent.contentTransformer.description')}
        />
      </Helmet>
      <div className="px-4 md:px-6 py-6">
        <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 max-w-7xl mx-auto">
          {/* Form Section */}
          <div className="w-full xl:w-1/2">
            <form
              className="h-full xl:h-[700px] p-6 bg-black-light rounded-xl border border-white/20 
            shadow-lg shadow-black/20 flex flex-col"
              onSubmit={handleSubmit}
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-brand" />
                <h1 className="text-xl font-semibold">
                  {t('contentTransformer.title')}
                </h1>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('contentTransformer.upload')}
                  </label>
                  <textarea
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    rows={6}
                    className="w-full p-3 outline-none text-sm rounded-lg 
                    border border-white/30 bg-black-medium/50
                    focus:border-brand focus:ring-1 focus:ring-brand/20
                    resize-none transition-all duration-200"
                    placeholder={
                      isRTL
                        ? 'الصق محتواك هنا (مقال، فكرة، نص...)'
                        : 'Paste your content here (article, idea, text...)'
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">
                    {t('contentTransformer.supports')}
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => handlePlatformToggle(platform.id)}
                        className={`p-3 rounded-lg border text-sm flex items-center gap-2 transition-all duration-200 ${
                          selectedPlatform === platform.id
                            ? 'bg-brand border-brand text-white shadow-lg shadow-brand/25'
                            : 'bg-black-medium/50 border-white/30 hover:border-brand/50 hover:bg-black-medium'
                        }`}
                      >
                        {platform.icon}
                        <span>{isRTL ? platform.nameAr : platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputContent || !selectedPlatform || isGenerating}
                className="w-full flex justify-center items-center gap-2 
                px-4 py-3 mt-6 text-sm font-medium
                bg-gradient-to-r from-[#ff512f] to-[#dd2476]
                disabled:cursor-not-allowed disabled:opacity-60
                rounded-lg text-white transition-all duration-200
                shadow-lg hover:shadow-xl hover:shadow-brand/25"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGenerating
                  ? isRTL
                    ? 'جاري تحويل المحتوى...'
                    : 'Transforming Content...'
                  : t('contentTransformer.btn')}
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
                <Repeat2 className="w-5 h-5 text-brand" />
                <h1 className="text-xl font-semibold">
                  {t('contentTransformer.result')}
                </h1>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                {generatedPost.text.length === 0 ? (
                  <div className="flex-1 flex justify-center items-center">
                    {isGenerating ? (
                      <div className="text-center space-y-4">
                        <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
                        <p className="text-sm text-gray-400">
                          {isRTL
                            ? 'جاري تحويل المحتوى...'
                            : 'Transforming your content...'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 max-w-xs">
                        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
                          <Repeat2 className="w-8 h-8 text-brand" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">
                            {isRTL
                              ? 'ابدأ في تحويل محتواك'
                              : 'Start Transforming Content'}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {isRTL
                              ? 'الصق محتواك، اختر المنصات، ثم اضغط "حول المحتوى"'
                              : 'Paste your content, select platforms, then click "Transform Content"'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="p-4 border border-white/20 rounded-lg bg-black-medium/30">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          {
                            platforms.find(
                              (p) =>
                                p.id === generatedPost.platform.toLowerCase()
                            )?.icon
                          }
                          <span className="text-sm font-medium text-brand">
                            {generatedPost.platform}
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(generatedPost.text)}
                          className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 
                            px-3 py-1 rounded-lg transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          {isRTL ? 'نسخ' : 'Copy'}
                        </button>
                      </div>
                      <Markdown>{generatedPost.text}</Markdown>
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

export default ContentTransformer;
