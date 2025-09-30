const express = require('express');
const { auth } = require('../middlewares/auth');
const aiController = require('../controllers/aiController');
const upload = require('../config/multer.js');
const router = express.Router();

router.post('/generate-article', auth, aiController.generateArticle);
router.post('/simplify-idea', auth, aiController.simplifyIdea);
router.post('/generate-image', auth, aiController.generateImage);
router.post(
  '/remove-background',
  auth,
  upload.single('image'),
  aiController.removeBackground
);
router.post('/transform-content', auth, aiController.transformContent);
router.post(
  '/review-resume',
  auth,
  upload.single('resume'),
  aiController.reviewResume
);
module.exports = router;
