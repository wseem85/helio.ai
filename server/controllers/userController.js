const sql = require('../config/db');

const getUserCreations = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate userId exists and is valid
    if (!userId) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID is required',
      });
    }

    // Validate userId format (if using UUID or specific format)
    if (typeof userId !== 'string' || userId.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID format',
      });
    }

    console.log('Fetching creations for user:', userId);

    const creations = await sql`
      SELECT * FROM creations 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC
    `;

    // Check if we got a valid response
    if (!creations) {
      return res.status(200).json({
        status: 'success',
        creations: [],
        message: 'No creations found for this user',
      });
    }

    res.status(200).json({
      status: 'success',
      creations,
      count: creations.length,
    });
  } catch (error) {
    console.error('Get user creations error:', error.message);

    // More specific error handling
    if (
      error.message.includes('timeout') ||
      error.message.includes('connection')
    ) {
      return res.status(503).json({
        status: 'error',
        message: 'Database temporarily unavailable. Please try again.',
      });
    }

    if (
      error.message.includes('invalid input syntax') ||
      error.message.includes('uuid')
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid user ID format',
      });
    }

    // Generic error for other cases
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user creations',
    });
  }
};
const getPublishedCreations = async (req, res) => {
  try {
    const userId = req.userId;
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.status(200).json({
      status: 'success',
      creations,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
const toggleLiked = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.body;
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id} `;
    if (!creation) {
      return res.status(400).json({
        status: 'error',
        message: 'The reuested Item is Not Found',
      });
    }
    const currentLikes = creation.likes;
    let updatedLikes;
    let message;
    if (currentLikes.includes(userId.toString())) {
      updatedLikes = currentLikes.filter((item) => item !== userId.toString());
      message = 'Creation Unliked';
    } else {
      updatedLikes = [...currentLikes, userId.toString()];
      message = 'Creation liked';
    }
    const newLikes = `{${updatedLikes.join(',')}}`;
    await sql`UPDATE creations SET likes = ${newLikes}::TEXT[] WHERE id=${id}`;
    res.status(200).json({
      status: 'success',
      message,
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};
const getAllReviews = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all reviews from database
    const reviews = await sql`SELECT * FROM reviews ORDER BY created_at DESC`;

    // Calculate statistics
    const totalRatings = reviews.length;

    const averageRating =
      totalRatings > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalRatings
        : 0;

    // Check if current user has reviewed
    const userReview = reviews.find((review) => review.user_id === userId);

    // Optional: Get rating distribution (how many of each star)
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      ratingDistribution[review.rating]++;
    });

    res.status(200).json({
      status: 'success',
      data: {
        reviews: reviews,
        statistics: {
          averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
          totalRatings,
          ratingDistribution,
          userHasReviewed: !!userReview,
          userRating: userReview ? userReview.rating : null,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};
const addReview = async (req, res) => {
  console.log('Creeeeating');
  try {
    const userId = req.userId;
    const { review, rating } = req.body;

    // Validate input
    if (!review || !rating) {
      return res.status(400).json({
        status: 'error',
        message: 'Please submit both your rating and your review',
      });
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if user has already reviewed
    const existingReview =
      await sql`SELECT * FROM reviews WHERE user_id = ${userId}`;

    if (existingReview.length > 0) {
      // Update existing review
      const [updatedReview] = await sql`
        UPDATE reviews SET review = ${review}, rating = ${rating}, updated_at = CURRENT_TIMESTAMP WHERE user_id = ${userId} RETURNING *
      `;

      return res.status(200).json({
        status: 'success',
        message: 'Review updated successfully!',
        data: {
          review: updatedReview,
          action: 'updated',
        },
      });
    } else {
      // Create new review

      const [newReview] = await sql`
        INSERT INTO reviews(user_id, review, rating) VALUES(${userId}, ${review}, ${rating}) RETURNING *`;

      return res.status(201).json({
        status: 'success',
        message: 'Review added successfully!',
        data: {
          review: newReview,
          action: 'created',
        },
      });
    }
  } catch (err) {
    console.log('Error in addReview:', err);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add review. Please try again.',
    });
  }
};

module.exports = {
  getUserCreations,
  getPublishedCreations,
  toggleLiked,
  getAllReviews,
  addReview,
};
