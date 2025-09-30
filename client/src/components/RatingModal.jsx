import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { NavLink } from 'react-router-dom';

const RatingModal = ({
  isOpen,
  onClose,
  onRate,
  currentRating = 0,
  currentReview = '',
  onError,
  error,
  user,
  isSubmitting = false,
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);
  const [review, setReview] = useState(currentReview);
  const handleStarClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = () => {
    if (!selectedRating) {
      onError('Please provide a Rateing, 5 stars would be fine :)');
    }
    if (!review) {
      onError('Please provide a Review, What do you think? :)');
    }
    if (selectedRating && review) {
      onError('');
      onRate(selectedRating, review);
      onClose();
    }
  };
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27 || event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent background scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-transparent  backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Content */}
      {user ? (
        <div className="relative bg-black-medium border-white/80 text-white-light rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
          <p className="text-xl font-medium  mb-4 text-center">
            5 Stars will be fine
          </p>

          {/* Star Rating */}
          <div className="flex justify-center mb-6">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= (hoverRating || selectedRating);
              return (
                <button
                  key={star}
                  className="p-1 focus:outline-none"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={isFilled ? '#e7ae4def' : 'none'}
                    stroke="#e7ae4def"
                    strokeWidth="1"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinejoin="round"
                      d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Rating Text */}
          <div className="my-2">
            <textarea
              defaultValue={currentReview}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What you Think ? "
              className="w-full bg-black-light text-white/80 outline-none p-2 border  "
              rows={4}
            />
          </div>
          {error && <p className="text-red-400 my-3">{error}</p>}
          {/* Action Buttons */}
          <div className="flex justify-between my-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-400 text-white hover:text-gray-50 hover:bg-red-500 rounded-xl duration-200   transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0 || isSubmitting}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                selectedRating === 0 || isSubmitting
                  ? 'bg-transparent opacity-30 cursor-not-allowed'
                  : 'bg-brand-light opacity-100 hover:bg-brand hover:text-white'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      ) : (
        <div className="relative bg-beige-light rounded-lg shadow-xl p-6 w-full max-w-md mx-4 flex flex-col gap-3">
          <button className="absolute text-2xl right-4 top-4" onClick={onClose}>
            &times;
          </button>
          <p className="text-lg font-medium mt-6  mb-4 text-center">
            You must Log in to perform this action
          </p>
          <p className="font-light mb-8">
            Please log in using your account , or create one if you do not have
            one yet
          </p>
          <NavLink
            className="text-white bg-brand rounded-md w-[120px] text-center max-w-[150px] mx-auto py-1.5 px-2"
            to="/login"
          >
            Log in
          </NavLink>
        </div>
      )}
    </div>,
    document.body
  );
};

export default RatingModal;
