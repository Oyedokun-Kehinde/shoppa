const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');

const router = express.Router();

// @route   POST /api/contact
// @desc    Send contact form email
// @access  Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, subject, message } = req.body;

      // Save to database
      const pool = getPool();
      await pool.query(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message]
      );

      // Email functionality can be added later
      // For now, we just save to database

      res.json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
  }
);

module.exports = router;
