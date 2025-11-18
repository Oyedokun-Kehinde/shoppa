const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');

const router = express.Router();

// @route   POST /api/chat/submit
// @desc    Submit live chat inquiry
// @access  Public
router.post(
  '/submit',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('question').trim().notEmpty().withMessage('Question is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, question } = req.body;
      const pool = getPool();

      await pool.query(
        'INSERT INTO chat_inquiries (name, email, question) VALUES ($1, $2, $3)',
        [name, email, question]
      );

      res.json({ message: 'Chat inquiry submitted successfully' });
    } catch (error) {
      console.error('Chat submission error:', error);
      res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
    }
  }
);

// @route   GET /api/chat/inquiries
// @desc    Get all chat inquiries (Admin only)
// @access  Private/Admin
router.get('/inquiries', async (req, res) => {
  try {
    const pool = getPool();
    const { rows: inquiries } = await pool.query(
      'SELECT * FROM chat_inquiries ORDER BY created_at DESC LIMIT 100'
    );

    res.json(inquiries);
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
