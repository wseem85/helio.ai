import { ArrowUpToLine, Edit, Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import Markdown from 'markdown-to-jsx';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const articleLengths = [
  { length: 600, text: 'Short (400-600 words)', textAr: 'قصير (٦٠٠-٤٠٠ كلمة)' },
  {
    length: 1000,
    text: 'Medium (600-1000 words)',
    textAr: 'متوسط (١٠٠٠-٦٠٠ كلمة)',
  },
  { length: 1600, text: 'Long (+1000 words)', textAr: 'طويل (+١٠٠٠ كلمة)' },
];

const GenerateArticle = () => {
  const [articleLength, setArticleLength] = useState(articleLengths[0].length);
  const [articleTopic, setArticleTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerating, setErrorGenerating] = useState('');
  const [response, setResponse] = useState('');
  const { getToken } = useAuth();
  const { t, isRTL } = useLanguage();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleGenerateArticle = async (e) => {
    e.preventDefault();
    try {
      if (!articleLength || !articleTopic) {
        toast.error('Please Provide an article subject and length to continue');
        return;
      }
      setResponse('');
      setErrorGenerating('');
      setIsGenerating(true);

      const token = await getToken();

      console.log('Generating article with language:', isRTL ? 'ar' : 'en');

      const { data } = await axios.post(
        BACKEND_URL + '/api/ai/generate-article',
        {
          prompt: articleTopic,
          length: articleLength,
          language: isRTL ? 'ar' : 'en', // Send language based on current locale
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.status === 'success') {
        console.log('Article generated in language:', data.metadata?.language);
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
                {t('generateArticles.articleConfig')}
              </h1>
            </div>

            <div className=" space-y-6 mb-12">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('generateArticles.articleTopic')}
                </label>
                <textarea
                  value={articleTopic}
                  onChange={(e) => setArticleTopic(e.target.value)}
                  rows={4}
                  className="w-full p-3 outline-none text-sm rounded-lg 
                    border border-white/30 bg-black-medium/50
                    focus:border-brand focus:ring-1 focus:ring-brand/20
                    resize-none transition-all duration-200"
                  placeholder={`${
                    isRTL
                      ? 'صف موضوع المقالة التي تريديني أن أولدها'
                      : 'Describe the topic you want to generate an article about...'
                  }`}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">
                  {t('generateArticles.articleLength')}
                </label>
                <div className="flex flex-wrap  gap-3">
                  {articleLengths.map((el, index) => (
                    <button
                      type="button"
                      onClick={() => setArticleLength(el.length)}
                      className={`text-xs p-3 rounded-full border transition-all duration-200
                        ${
                          articleLength === el.length
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
            </div>

            <button
              onClick={handleGenerateArticle}
              disabled={
                articleTopic.length < 10 || !articleLength || isGenerating
              }
              className="w-full flex justify-center items-center gap-2 
                px-4 py-3 mt-6 text-sm font-medium
                bg-gradient-to-r from-[#cc2b5e] to-[#753a88]
              
                
                disabled:cursor-not-allowed disabled:opacity-60
                rounded-lg text-white transition-all duration-200
                shadow-lg hover:shadow-xl hover:shadow-brand/25"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Edit className="w-4 h-4" />
              )}
              {isGenerating
                ? isRTL
                  ? 'جاري إنشاء المقالة...'
                  : 'Generating Article...'
                : t('generateArticles.articleGenerateBtn')}
            </button>
            {errorGenerating ? (
              <p className="text-red-400 mt-3 text-center px-4 py-2 text-sm">
                {errorGenerating}
              </p>
            ) : null}
          </form>
        </div>

        {/* Results Section */}
        <div className="w-full xl:w-1/2">
          <div
            className="h-full xl:h-[700px] p-6 bg-black-light rounded-xl border border-white/20 
            shadow-lg shadow-black/20 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <Edit className="w-5 h-5 text-brand" />
              <h1 className="text-xl font-semibold">
                {t('generateArticles.generatedArticle')}
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
                          ? 'جاري إنشاء المقالة...'
                          : 'Generating your article...'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 max-w-xs">
                      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
                        <Edit className="w-8 h-8 text-brand" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {isRTL
                            ? 'ابدأ في كتابة مقالتك'
                            : 'Start Creating Your Article'}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {isRTL
                            ? 'صف موضوع المقالة في الصندوق المخصص ثم اضغط على "اكتب المقالة"'
                            : 'Enter a topic and select length, then click "Generate Article"'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="prose prose-invert max-w-none">
                    <Markdown
                      options={{
                        forceBlock: true,
                        overrides: {
                          h1: {
                            component: 'h1',
                            props: {
                              className:
                                'text-2xl font-bold my-6 text-white border-b border-white/20 pb-2',
                            },
                          },
                          h2: {
                            component: 'h2',
                            props: {
                              className: 'text-xl font-bold my-4 text-white',
                            },
                          },
                          h3: {
                            component: 'h3',
                            props: {
                              className:
                                'text-lg font-semibold my-3 text-white',
                            },
                          },
                          p: {
                            component: 'p',
                            props: {
                              className: 'mb-4 leading-relaxed text-gray-300',
                            },
                          },
                          ul: {
                            component: 'ul',
                            props: {
                              className:
                                'list-disc list-inside mb-4 space-y-1 text-gray-300',
                            },
                          },
                          ol: {
                            component: 'ol',
                            props: {
                              className:
                                'list-decimal list-inside mb-4 space-y-1 text-gray-300',
                            },
                          },
                          strong: {
                            component: 'strong',
                            props: {
                              className: 'font-semibold text-white',
                            },
                          },
                          em: {
                            component: 'em',
                            props: {
                              className: 'italic text-brand',
                            },
                          },
                        },
                      }}
                    >
                      {response}
                    </Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateArticle;
