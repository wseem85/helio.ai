const { clerkClient, getAuth } = require('@clerk/express');
const auth = async (req, res, next) => {
  try {
    console.log('request reched auth function');
    const { userId, has } = getAuth(req);

    console.log(userId);
    if (!userId) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized - User not authenticated',
      });
    }
    const hasPremiumPlan = await has({ plan: 'premium' });
    const user = await clerkClient.users.getUser(userId);
    if (!hasPremiumPlan && user.privateMetadata.free_usage) {
      req.free_usage = user.privateMetadata.free_usage;
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
    }
    req.userId = userId;
    req.plan = hasPremiumPlan ? 'premium' : 'free';
    next();
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

module.exports = { auth };
