import { Eraser, Loader2, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import useLanguage from '../hooks/useLanguage';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const RemoveBackground = () => {
  const [inputImage, setInputImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorGenerating, setErrorGenerating] = useState('');
  const [response, setResponse] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const { getToken } = useAuth();
  const { t, isRTL } = useLanguage();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!inputImage) {
        toast.error('Please upload an image file');
        return;
      }
      setResponse('');
      setErrorGenerating('');
      setIsGenerating(true);

      const formData = new FormData();
      formData.append('image', inputImage);
      formData.append('language', isRTL ? 'Arabic' : 'English');
      const token = await getToken();
      const { data } = await axios.post(
        BACKEND_URL + '/api/ai/remove-background',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }

      setInputImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
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
            onSubmit={handleSubmit}
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-brand" />
              <h1 className="text-xl font-semibold">
                {t('backgroundRemoval.title')}
              </h1>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('backgroundRemoval.upload')}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-3 outline-none text-sm rounded-lg 
                      border border-white/30 bg-black-medium/50
                      focus:border-brand focus:ring-1 focus:ring-brand/20
                      transition-all duration-200
                      file:mr-4 file:py-2 file:px-4 
                      file:rounded-lg file:border-0 
                      file:text-sm file:font-medium 
                      file:bg-brand file:text-white 
                      hover:file:bg-brand-dark
                      file:cursor-pointer cursor-pointer"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {t('backgroundRemoval.supports')}
                </p>
                {inputImage && (
                  <div className="mt-2 p-2 bg-black-medium/30 rounded-lg">
                    <p className="text-xs text-green-400 flex items-center gap-2">
                      <Eraser className="w-3 h-3" />
                      {inputImage.name} (
                      {(inputImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                )}
              </div>

              {previewImage && (
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Preview
                  </label>
                  <div className="border border-white/20 rounded-lg p-2 bg-black-medium/30">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full max-h-48 object-contain mx-auto rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!inputImage || isGenerating}
              className="w-full flex justify-center items-center gap-2 
                px-4 py-3 mt-6 text-sm font-medium
                bg-gradient-to-r from-[#de6262] to-[#ac5017]
                disabled:cursor-not-allowed disabled:opacity-60
                rounded-lg text-white transition-all duration-200
                shadow-lg hover:shadow-xl hover:shadow-brand/25"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eraser className="w-4 h-4" />
              )}
              {isGenerating
                ? isRTL
                  ? 'جاري إزالة الخلفية...'
                  : 'Removing Background...'
                : t('backgroundRemoval.btn')}
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
              <Eraser className="w-5 h-5 text-brand" />
              <h1 className="text-xl font-semibold">
                {t('backgroundRemoval.result')}
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
                          ? 'جاري إزالة الخلفية...'
                          : 'Removing background...'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-4 max-w-xs">
                      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
                        <Eraser className="w-8 h-8 text-brand" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">
                          {isRTL
                            ? 'ابدأ في إزالة خلفية صورتك'
                            : 'Start Removing Background'}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {isRTL
                            ? 'قم برفع صورة ثم انقر على "إزالة الخلفية"'
                            : 'Upload an image and click "Remove Background"'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex justify-center items-center">
                  <div className="max-w-full max-h-full space-y-4">
                    <img
                      src={response}
                      alt="Background Removed"
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = response;
                        link.download = 'background-removed.png';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="w-full bg-brand/20 hover:bg-brand/30 border border-brand/40 
                        text-brand px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      {isRTL ? 'تحميل الصورة' : 'Download Image'}
                    </button>
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

export default RemoveBackground;
