import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useLanguage from '../hooks/useLanguage';
import { Heart, Loader2 } from 'lucide-react';
import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';

const Community = () => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [errorRating, setErrorRating] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const { getToken } = useAuth();
  const { t, isRTL } = useLanguage();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Cache key constants
  const QUERY_KEYS = {
    CREATIONS: ['community-creations'],
    REVIEWS: ['community-reviews'],
  };

  // Fetch creations with React Query
  const {
    data: creationsData,
    isLoading: loadingData,
    error: errorGettingData,
    refetch: refetchData,
  } = useQuery({
    queryKey: [...QUERY_KEYS.CREATIONS, isRTL ? 'ar' : 'en'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/published-creations`,
        { language: isRTL ? 'Arabic' : 'English' },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000,
        }
      );
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
  });

  const creations = creationsData?.creations || [];

  // Fetch reviews with React Query
  const {
    data: reviewsData,
    isLoading: loadingReviews,
    refetch: fetchReviews,
  } = useQuery({
    queryKey: QUERY_KEYS.REVIEWS,
    queryFn: async () => {
      const token = await getToken();
      const { data } = await axios.get(`${BACKEND_URL}/api/user/all-reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000,
      });
      return data;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    onSuccess: (data) => {
      if (data?.data?.statistics?.userHasReviewed) {
        setUserRating(data.data.statistics.userRating);
        const userReviewData = data.data.reviews?.find(
          (review) => review.user_id === user?.id
        );
        if (userReviewData) {
          setUserReview(userReviewData.review);
        }
      }
    },
  });

  const reviews = reviewsData?.data || {};

  // Toggle like mutation with optimistic updates
  const toggleLikeMutation = useMutation({
    mutationFn: async (id) => {
      const token = await getToken();
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/toggle-liked`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 12000,
        }
      );
      return { data, id };
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.CREATIONS });

      // Snapshot the previous value
      const previousCreations = queryClient.getQueryData([
        ...QUERY_KEYS.CREATIONS,
        isRTL ? 'ar' : 'en',
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [...QUERY_KEYS.CREATIONS, isRTL ? 'ar' : 'en'],
        (old) => {
          if (!old?.creations) return old;
          return {
            ...old,
            creations: old.creations.map((creation) => {
              if (creation.id === id) {
                const isCurrentlyLiked = creation.likes.includes(user.id);
                return {
                  ...creation,
                  likes: isCurrentlyLiked
                    ? creation.likes.filter((likeId) => likeId !== user.id)
                    : [...creation.likes, user.id],
                };
              }
              return creation;
            }),
          };
        }
      );

      return { previousCreations };
    },
    onError: (err, id, context) => {
      // Rollback on error
      queryClient.setQueryData(
        [...QUERY_KEYS.CREATIONS, isRTL ? 'ar' : 'en'],
        context.previousCreations
      );
      toast.error(`Failed to toggle like: ${err.message}`);
    },
    onSuccess: ({ data }) => {
      if (data.status === 'success') {
        toast.success(data.message);
      }
    },
  });

  const handleToggleLike = (id) => {
    toggleLikeMutation.mutate(id);
  };

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ rating, review }) => {
      const token = await getToken();
      setIsSubmittingReview(true);
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/add-review`,
        { review, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000,
        }
      );
      return data;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast.success(data.message || 'Review submitted successfully!');

        // Invalidate and refetch reviews
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS });

        setIsRatingModalOpen(false);
        setErrorRating('');
        setIsSubmittingReview(false);
      }
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit review';
      toast.error(errorMessage);
      setErrorRating(errorMessage);
      setIsSubmittingReview(false);
    },
  });

  const handleRate = async (rating, review) => {
    submitReviewMutation.mutate({ rating, review });
  };

  const handleRetry = () => {
    refetchData();
  };

  // Remove the useEffect since React Query handles fetching automatically

  return (
    <div className="flex-1 h-full w-full flex flex-col items-center gap-4 p-6 mt-12 md:mt-0">
      <div className="mb-8 pb-4 border-b border-white/60 w-full">
        <h3 className="text-2xl tracking-wide mb-2">
          {t('community.creationsHeading')}
        </h3>
        <p className="text-white/70 mb-6">
          {t('community.creationsSubHeading')}
        </p>
        <div className="bg-black-light h-full w-full rounded-xl min-h-[300px]">
          {loadingData && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="text-brand animate-spin w-8 h-8 mx-auto mb-2" />
                <p className="text-white/70 text-sm">
                  {isRTL ? 'جاري التحميل...' : 'Loading community creations...'}
                </p>
              </div>
            </div>
          )}

          {!loadingData && errorGettingData && (
            <div className="flex flex-col justify-center items-center min-h-[300px] p-6">
              <p className="text-red-400 text-center mb-4">
                {isRTL
                  ? `حدث خطأ أثناء تحميل البيانات : ${errorGettingData}`
                  : `Error getting shared data: ${errorGettingData}`}
              </p>
              <button
                onClick={handleRetry}
                className="bg-brand hover:bg-brand/80 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isRTL ? 'حاول مجددا' : 'Try Again'}
              </button>
            </div>
          )}

          {!errorGettingData && !loadingData && !creations.length && (
            <div className="min-h-[200px] flex justify-center items-center p-6">
              <div className="text-center">
                <p className="mb-4">
                  {isRTL
                    ? 'لم يتم مشاركة أي صور منشأة باستخدام تطبيقنا من قبل المجتمع بعد'
                    : 'There are no images generated using our app shared by the community'}
                </p>
                <p>
                  {isRTL
                    ? 'كُن أول من يشارك الصور المُنشأة مع المجتمع من خلال التوجّه إلى'
                    : 'Be the first one to share generated images with the community by going to'}
                  <NavLink
                    to="/ai/generate-image"
                    className="text-brand underline hover:text-brand/80"
                  >
                    {isRTL ? 'مولد الصور' : 'Generate Images'}
                  </NavLink>{' '}
                  {isRTL ? 'تأكد من تفعيل زر ' : 'and make sure to toggle'}
                  <span className="text-green-400">
                    {isRTL ? 'شارك الصورة مع مجتمعنا' : 'publish'}
                  </span>{' '}
                  {!isRTL ? 'on.' : null}
                </p>
              </div>
            </div>
          )}

          {!loadingData && !errorGettingData && creations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {creations.map((creation, index) => (
                <div
                  key={creation.id || index}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={creation.content}
                    alt={creation.prompt || 'Community creation'}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-sm text-white mb-2 line-clamp-2">
                        {creation.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-white text-sm">
                          {creation.likes?.length || 0} likes
                        </p>
                        <Heart
                          onClick={() => handleToggleLike(creation.id)}
                          className={`w-5 h-5 hover:scale-105 cursor-pointer transition-transform ${
                            creation.likes?.includes(user?.id)
                              ? 'fill-red-500 text-red-600'
                              : 'text-white hover:text-red-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full">
        <h3 className="text-2xl tracking-wide mb-2">
          {t('community.reviewsHeading')}
        </h3>
        <p className="text-white/70 mb-6">{t('community.reviewsSubHeading')}</p>

        {/* Stats Section */}
        {!loadingData && !errorGettingData && reviews?.statistics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="px-5 py-4 rounded-xl bg-black-light shadow-sm shadow-white/50">
              <h3 className="text-lg mb-1">{t('community.averageRating')}</h3>
              <p className="text-2xl font-semibold text-brand">
                {reviews.statistics.averageRating || 0}
              </p>
              <p className="text-white/50 text-sm">
                {t('community.averageRatingHint')}
              </p>
            </div>

            <div className="px-5 py-4 rounded-xl bg-black-light shadow-sm shadow-white/50">
              <h3 className="text-lg mb-1">
                {t('community.communityReviews')}
              </h3>
              <p className="text-2xl font-semibold text-white">
                {reviews.statistics.totalRatings || 0}
              </p>
              <p className="text-white/50 text-sm">
                {t('community.communityReviewsHint')}
              </p>
            </div>
          </div>
        )}

        {(loadingReviews || loadingData) && (
          <div className="flex justify-center items-center min-h-[100px]">
            <div className="text-center">
              <Loader2 className="text-brand animate-spin w-8 h-8 mx-auto mb-2" />
              <p className="text-white/70 text-sm">
                {isRTL ? 'جاري التحميل...' : 'Loading community reviews...'}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic User Rating Box */}
        {reviews?.statistics?.userHasReviewed ? (
          <div className="px-5 py-4 rounded-xl bg-brand/20 border border-brand/30 mb-8">
            <h3 className="text-lg mb-1">{t('community.userRating')}</h3>
            <StarRating rating={reviews.statistics.userRating} />
            <p className="text-white/70 text-sm mt-2">
              {t('community.thanksRating')}✨
            </p>
            <p className="text-white/60 text-sm mt-1">"{userReview}"</p>
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="mt-2 text-brand hover:text-brand/80 text-sm underline"
            >
              {t('community.updateRating')}
            </button>
          </div>
        ) : !loadingData && !loadingReviews ? (
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={() => setIsRatingModalOpen(true)}
              disabled={isSubmittingReview}
              className="bg-black-light cursor-pointer text-white/60 px-6 py-3 rounded-lg border border-white/60 hover:border-white/80 hover:text-white/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingReview
                ? `${isRTL ? 'يتم رفع تقييمك...' : 'Submitting...'}`
                : `${t('community.rateBtn')}`}
            </button>
          </div>
        ) : null}

        {isRatingModalOpen && (
          <RatingModal
            isOpen={isRatingModalOpen}
            onClose={() => {
              setIsRatingModalOpen(false);
              setErrorRating('');
            }}
            currentRating={userRating}
            currentReview={userReview}
            onRate={handleRate}
            onError={setErrorRating}
            error={errorRating}
            user={user}
            isSubmitting={isSubmittingReview}
          />
        )}

        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="text-xl mb-4">{t('community.reviews')}</h3>
          {loadingReviews ? (
            <div className="flex justify-center py-4">
              <Loader2 className="text-brand animate-spin w-6 h-6" />
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {reviews?.reviews && reviews.reviews.length > 0 ? (
                reviews.reviews.slice(0, 5).map((review, index) => (
                  <div key={index} className="bg-black-light p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-white/60 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-white/80">{review.review}</p>
                  </div>
                ))
              ) : (
                <p className="text-white/70">
                  {isRTL ? 'جاري تحميل المراجعات...' : 'Reviews coming soon...'}
                </p>
              )}
            </div>
          )}
          {!loadingReviews && (
            <button
              onClick={fetchReviews}
              className="text-brand hover:text-brand/80 transition-colors"
            >
              {t('community.refreshReviews')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
