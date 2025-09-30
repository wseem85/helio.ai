const express = require('express');
const { auth } = require('../middlewares/auth');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/user-creations', auth, userController.getUserCreations);
router.post('/published-creations', auth, userController.getPublishedCreations);
router.post('/toggle-liked', auth, userController.toggleLiked);
router.post('/add-review', auth, userController.addReview);
router.get('/all-reviews', auth, userController.getAllReviews);
module.exports = router;
