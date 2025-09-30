import React from 'react';

const StarRating = ({ rating, size = 24, color = '#e7ae4def' }) => {
  // Ensure rating is between 0 and 5
  const clampedRating = Math.min(Math.max(parseFloat(rating) || 0, 0), 5);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      <div className="flex">
        {/* Full stars */}
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={color}
            width={size}
            height={size}
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative" style={{ width: size, height: size }}>
            {/* Empty star background */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              width={size}
              height={size}
              className="absolute top-0 left-0"
            >
              <path
                strokeLinejoin="round"
                strokeWidth="1"
                d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"
              />
            </svg>

            {/* Half-filled star */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={color}
              width={size}
              height={size}
              className="absolute top-0 left-0"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            >
              <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
            </svg>
          </div>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            width={size}
            height={size}
          >
            <path
              strokeLinejoin="round"
              strokeWidth="1"
              d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"
            />
          </svg>
        ))}
      </div>

      {/* Optional: Display rating number */}
      <span className="ml-2 text-gray-600" style={{ fontSize: size * 0.6 }}>
        {clampedRating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;
