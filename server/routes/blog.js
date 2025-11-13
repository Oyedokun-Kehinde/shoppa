const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blog/posts
// @desc    Get all blog posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const pool = getPool();
    const [posts] = await pool.query(
      `SELECT id, title, slug, excerpt, content, category, author, featured_image, 
       published, created_at, updated_at 
       FROM blog_posts 
       WHERE published = TRUE 
       ORDER BY created_at DESC`
    );

    res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blog/posts/:slug
// @desc    Get single blog post by slug
// @access  Public
router.get('/posts/:slug', async (req, res) => {
  try {
    const pool = getPool();
    const [posts] = await pool.query(
      `SELECT id, title, slug, excerpt, content, category, author, featured_image, 
       published, created_at, updated_at 
       FROM blog_posts 
       WHERE slug = ? AND published = TRUE`,
      [req.params.slug]
    );

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(posts[0]);
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blog/posts
// @desc    Create a blog post (Admin only)
// @access  Private/Admin
router.post(
  '/posts',
  protect,
  admin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, excerpt, content, category, author, featured_image, published } = req.body;
      const pool = getPool();

      // Create slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const [result] = await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category, author, featured_image, published) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, slug, excerpt, content, category, author, featured_image, published || false]
      );

      const [posts] = await pool.query(
        'SELECT * FROM blog_posts WHERE id = ?',
        [result.insertId]
      );

      res.status(201).json(posts[0]);
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
