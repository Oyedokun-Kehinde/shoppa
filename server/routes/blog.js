const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');
const { protect, admin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blog/posts
// @desc    Get all blog posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const pool = getPool();
    const { rows: posts } = await pool.query(
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
    const { rows: posts } = await pool.query(
      `SELECT id, title, slug, excerpt, content, category, author, featured_image, 
       published, created_at, updated_at 
       FROM blog_posts 
       WHERE slug = $1 AND published = TRUE`,
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

      const { rows: [result] } = await pool.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category, author, featured_image, published) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [title, slug, excerpt, content, category, author, featured_image, published || false]
      );

      res.status(201).json(result);
    } catch (error) {
      console.error('Create blog post error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// @route   GET /api/blog/:id/comments
// @desc    Get blog post comments
// @access  Public
router.get('/:id/comments', async (req, res) => {
  try {
    const pool = getPool();
    const { rows: comments } = await pool.query(
      `SELECT bc.*, u.name as user_name 
       FROM blog_comments bc 
       JOIN users u ON bc.user_id = u.id 
       WHERE bc.blog_post_id = $1 
       ORDER BY bc.created_at DESC`,
      [req.params.id]
    );

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blog/:id/comments
// @desc    Add a comment to blog post
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    const pool = getPool();

    await pool.query(
      'INSERT INTO blog_comments (blog_post_id, user_id, comment) VALUES ($1, $2, $3)',
      [req.params.id, req.user.id, comment]
    );

    // Update comments count
    await pool.query(
      `UPDATE blog_posts 
       SET comments_count = (SELECT COUNT(*) FROM blog_comments WHERE blog_post_id = $1) 
       WHERE id = $1`,
      [req.params.id]
    );

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/blog/:id/reaction
// @desc    Add/update reaction to blog post (logged in or anonymous)
// @access  Public
router.post('/:id/reaction', optionalAuth, async (req, res) => {
  try {
    const { reaction_type, session_id } = req.body;
    const pool = getPool();
    const userId = req.user ? req.user.id : null;

    // Validate reaction type
    const validReactions = ['like', 'love', 'insightful', 'celebrate'];
    if (!validReactions.includes(reaction_type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    // Check if user/session already reacted
    let existingReaction;
    if (userId) {
      const { rows } = await pool.query(
        'SELECT * FROM blog_reactions WHERE blog_post_id = $1 AND user_id = $2',
        [req.params.id, userId]
      );
      existingReaction = rows;
    } else if (session_id) {
      const { rows } = await pool.query(
        'SELECT * FROM blog_reactions WHERE blog_post_id = $1 AND session_id = $2',
        [req.params.id, session_id]
      );
      existingReaction = rows;
    } else {
      return res.status(400).json({ message: 'User ID or session ID required' });
    }

    if (existingReaction.length > 0) {
      // Update existing reaction
      await pool.query(
        'UPDATE blog_reactions SET reaction_type = $1 WHERE id = $2',
        [reaction_type, existingReaction[0].id]
      );
    } else {
      // Insert new reaction
      await pool.query(
        'INSERT INTO blog_reactions (blog_post_id, user_id, session_id, reaction_type) VALUES ($1, $2, $3, $4)',
        [req.params.id, userId, session_id, reaction_type]
      );
    }

    // Update reaction counts
    const { rows: reactions } = await pool.query(
      `SELECT 
        SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as likes,
        SUM(CASE WHEN reaction_type = 'love' THEN 1 ELSE 0 END) as loves,
        SUM(CASE WHEN reaction_type = 'insightful' THEN 1 ELSE 0 END) as insightful,
        SUM(CASE WHEN reaction_type = 'celebrate' THEN 1 ELSE 0 END) as celebrate
       FROM blog_reactions WHERE blog_post_id = $1`,
      [req.params.id]
    );

    await pool.query(
      `UPDATE blog_posts 
       SET likes_count = $1, loves_count = $2, insightful_count = $3, celebrate_count = $4 
       WHERE id = $5`,
      [reactions[0].likes, reactions[0].loves, reactions[0].insightful, reactions[0].celebrate, req.params.id]
    );

    // Return updated counts
    res.json({ 
      message: 'Reaction added successfully',
      counts: {
        likes_count: reactions[0].likes || 0,
        loves_count: reactions[0].loves || 0,
        insightful_count: reactions[0].insightful || 0,
        celebrate_count: reactions[0].celebrate || 0
      }
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/blog/:id/reaction
// @desc    Get user's reaction to blog post
// @access  Public (optional auth)
router.get('/:id/reaction', optionalAuth, async (req, res) => {
  try {
    const pool = getPool();
    const userId = req.user?.id;
    const session_id = req.body.session_id || req.headers['x-session-id'];

    if (!userId && !session_id) {
      return res.json({ reaction: null });
    }

    let reactions;
    if (userId) {
      const { rows } = await pool.query(
        'SELECT reaction_type FROM blog_reactions WHERE blog_post_id = $1 AND user_id = $2',
        [req.params.id, userId]
      );
      reactions = rows;
    } else {
      const { rows } = await pool.query(
        'SELECT reaction_type FROM blog_reactions WHERE blog_post_id = $1 AND session_id = $2',
        [req.params.id, session_id]
      );
      reactions = rows;
    }

    if (reactions.length > 0) {
      res.json({ reaction: reactions[0].reaction_type });
    } else {
      res.json({ reaction: null });
    }
  } catch (error) {
    console.error('Get reaction error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
