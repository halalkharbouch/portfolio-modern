import express from 'express';
import multer from 'multer';
import {
  getBlogs,
  createComment,
  createBlogPost,
  createReply,
  getBlog,
} from '../controllers/blog.controller.js';
import {
  authenticateToken,
  authorizeRole,
  limiter,
} from '../middleware/auth.middleware.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post(
  '/add-blog-post',
  authenticateToken,
  authorizeRole(['admin']),
  limiter,
  upload.array('blogImgUrls', 5),
  createBlogPost,
);
router.post('/add-comment/:blogId', createComment);
router.post('/add-reply/:commentId', createReply);

export default router;
