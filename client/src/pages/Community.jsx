import React, { useEffect, useState, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import useLanguage from '../hooks/useLanguage';
import { Heart, Loader2 } from 'lucide-react';
import StarRating from '../components/StarRating';
import RatingModal from '../components/RatingModal';

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorGettingData, setErrorGettingData] = useState('');
  const [reviews, setReviews] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [errorRating, setErrorRating] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { getToken } = useAuth();
  const { isRTL } = useLanguage();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useUser();

  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const token = await getToken();

      const { data } = await axios.get(`${BACKEND_URL}/api/user/all-reviews`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000,
      });

      if (data.status === 'success') {
        setReviews(data.data || {});

        // Update user rating and review if they exist
        if (data.data?.statistics?.userHasReviewed) {
          setUserRating(data.data.statistics.userRating);
          const userReviewData = data.data.reviews?.find(
            (review) => review.user_id === user?.id
          );
          if (userReviewData) {
            setUserReview(userReviewData.review);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error(`Failed to get reviews: ${error.message}`);
    } finally {
      setLoadingReviews(false);
    }
  }, [getToken, BACKEND_URL, user?.id]);

  const fetchData = useCallback(async () => {
    try {
      setErrorGettingData('');
      setLoadingData(true);
      const token = await getToken();

      const axiosConfig = {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 20000,
      };

      const [creationsResponse, reviewsResponse] = await Promise.allSettled([
        axios.post(
          `${BACKEND_URL}/api/user/published-creations`,
          { language: isRTL ? 'Arabic' : 'English' },
          axiosConfig
        ),
        axios.get(`${BACKEND_URL}/api/user/all-reviews`, axiosConfig),
      ]);

      // Handle creations response
      if (
        creationsResponse.status === 'fulfilled' &&
        creationsResponse.value.data.status === 'success'
      ) {
        setCreations(creationsResponse.value.data.creations);
      } else if (creationsResponse.status === 'rejected') {
        console.error('Failed to fetch creations:', creationsResponse.reason);
        toast.error(
          `Failed to get creations: ${creationsResponse.reason.message}`
        );
      }

      // Handle reviews response
      if (
        reviewsResponse.status === 'fulfilled' &&
        reviewsResponse.value.data.status === 'success'
      ) {
        setReviews(reviewsResponse.value.data.data || {});

        // Update user rating and review if they exist
        if (reviewsResponse.value.data.data?.statistics?.userHasReviewed) {
          setUserRating(reviewsResponse.value.data.data.statistics.userRating);
          const userReviewData = reviewsResponse.value.data.data.reviews?.find(
            (review) => review.user_id === user?.id
          );
          if (userReviewData) {
            setUserReview(userReviewData.review);
          }
        }
      } else if (reviewsResponse.status === 'rejected') {
        console.error('Failed to fetch reviews:', reviewsResponse.reason);
      }
    } catch (error) {
      console.error('Unexpected error in fetchData:', error);
      toast.error(`Failed to get data: ${error.message}`);
      setErrorGettingData(error.message);
    } finally {
      setLoadingData(false);
    }
  }, [getToken, BACKEND_URL, isRTL, user?.id]);

  const handleToggleLike = async (id) => {
    try {
      // Optimistically update the UI first
      setCreations((prevCreations) =>
        prevCreations.map((creation) => {
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
        })
      );

      const token = await getToken();
      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/toggle-liked`,
        { id },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 12000,
        }
      );

      if (data.status === 'success') {
        toast.success(data.message);
      }
    } catch (error) {
      // Revert the optimistic update
      setCreations((prevCreations) =>
        prevCreations.map((creation) => {
          if (creation.id === id) {
            const isCurrentlyLiked = creation.likes.includes(user.id);
            return {
              ...creation,
              likes: isCurrentlyLiked
                ? [...creation.likes, user.id]
                : creation.likes.filter((likeId) => likeId !== user.id),
            };
          }
          return creation;
        })
      );

      toast.error(`Failed to toggle like: ${error.message}`);
      console.error('Error toggling like:', error);
    }
  };

  const handleRate = async (rating, review) => {
    if (submittingReview) return;

    setSubmittingReview(true);
    setErrorRating('');

    try {
      const token = await getToken();

      const { data } = await axios.post(
        `${BACKEND_URL}/api/user/add-review`,
        { review, rating },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 20000,
        }
      );
      console.log(data);
      if (data.status === 'success') {
        toast.success(data.message || 'Review submitted successfully!');

        // Update local state immediately for better UX
        setUserRating(rating);
        setUserReview(review);

        // Update reviews state to reflect the new review

        fetchReviews();

        // Close modal
        setIsRatingModalOpen(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to submit review';
      toast.error(errorMessage);
      console.error('Error submitting review:', error);
      setErrorRating(errorMessage);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      if (isMounted) {
        await fetchData();
      }
    }

    if (user && isMounted) {
      getData();
    }

    return () => {
      isMounted = false;
    };
  }, [user, fetchData]);

  const handleRetry = () => {
    if (user) {
      fetchData();
    }
  };

  return (
    <div className="flex-1 h-full w-full flex flex-col items-center gap-4 p-6 mt-12 md:mt-0">
      <div className="mb-8 pb-4 border-b border-white/60 w-full">
        <h3 className="text-2xl tracking-wide mb-2">
          Creative Creations made by our community
        </h3>
        <div className="bg-black-light h-full w-full rounded-xl min-h-[300px]">
          {loadingData && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center">
                <Loader2 className="text-brand animate-spin w-8 h-8 mx-auto mb-2" />
                <p className="text-white/70 text-sm">
                  Loading community creations...
                </p>
              </div>
            </div>
          )}

          {!loadingData && errorGettingData && (
            <div className="flex flex-col justify-center items-center min-h-[300px] p-6">
              <p className="text-red-400 text-center mb-4">
                Error getting shared data: {errorGettingData}
              </p>
              <button
                onClick={handleRetry}
                className="bg-brand hover:bg-brand/80 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {!errorGettingData && !loadingData && !creations.length && (
            <div className="min-h-[200px] flex justify-center items-center p-6">
              <div className="text-center">
                <p className="mb-4">
                  There are no images generated using our app shared by the
                  community
                </p>
                <p>
                  Be the first one to share generated images with the community
                  by going to{' '}
                  <NavLink
                    to="/ai/generate-image"
                    className="text-brand underline hover:text-brand/80"
                  >
                    Generate Images
                  </NavLink>{' '}
                  and make sure to toggle{' '}
                  <span className="text-green-400">publish</span> on.
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
          Love Our App? Share Your Experience!
        </h3>
        <p className="text-white/70 mb-6">
          Your feedback helps us improve and helps others discover our app
        </p>

        {/* Stats Section */}
        {!loadingData && !errorGettingData && reviews?.statistics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <div className="px-5 py-4 rounded-xl bg-black-light shadow-sm shadow-white/50">
              <h3 className="text-lg mb-1">Average Rating</h3>
              <p className="text-2xl font-semibold text-brand">
                {reviews.statistics.averageRating || 0}
              </p>
              <p className="text-white/50 text-sm">out of 5 stars</p>
            </div>

            <div className="px-5 py-4 rounded-xl bg-black-light shadow-sm shadow-white/50">
              <h3 className="text-lg mb-1">Community Reviews</h3>
              <p className="text-2xl font-semibold text-white">
                {reviews.statistics.totalRatings || 0}
              </p>
              <p className="text-white/50 text-sm">and counting</p>
            </div>
          </div>
        )}

        {(loadingReviews || loadingData) && (
          <div className="flex justify-center items-center min-h-[100px]">
            <div className="text-center">
              <Loader2 className="text-brand animate-spin w-8 h-8 mx-auto mb-2" />
              <p className="text-white/70 text-sm">
                Loading community reviews...
              </p>
            </div>
          </div>
        )}

        {/* Dynamic User Rating Box */}
        {reviews?.statistics?.userHasReviewed ? (
          <div className="px-5 py-4 rounded-xl bg-brand/20 border border-brand/30 mb-8">
            <h3 className="text-lg mb-1">Your Rating</h3>
            <StarRating rating={reviews.statistics.userRating} />
            <p className="text-white/70 text-sm mt-2">
              Thanks for your feedback! ✨
            </p>
            <p className="text-white/60 text-sm mt-1">"{userReview}"</p>
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="mt-2 text-brand hover:text-brand/80 text-sm underline"
            >
              Update your review
            </button>
          </div>
        ) : !loadingData && !loadingReviews ? (
          <div className="flex items-center justify-center mb-8">
            <button
              onClick={() => setIsRatingModalOpen(true)}
              disabled={submittingReview}
              className="bg-black-light cursor-pointer text-white/60 px-6 py-3 rounded-lg border border-white/60 hover:border-white/80 hover:text-white/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingReview ? 'Submitting...' : 'Rate Our App'}
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
            isSubmitting={submittingReview}
          />
        )}

        {/* Reviews Section */}
        <div className="mt-8">
          <h3 className="text-xl mb-4">What Our Users Say</h3>
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
                <p className="text-white/70">Reviews coming soon...</p>
              )}
            </div>
          )}
          {!loadingReviews && (
            <button
              onClick={fetchReviews}
              className="text-brand hover:text-brand/80 transition-colors"
            >
              Refresh Reviews →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
