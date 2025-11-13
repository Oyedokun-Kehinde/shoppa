const express = require('express');
const { body, validationResult } = require('express-validator');
const { getPool } = require('../config/database');

const router = express.Router();

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post(
  '/subscribe',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const pool = getPool();

      // Check if email already exists
      const [existing] = await pool.query('SELECT * FROM newsletter WHERE email = ?', [email]);
      
      if (existing.length > 0) {
        if (existing[0].subscribed) {
          return res.status(400).json({ message: 'This email is already subscribed to our newsletter' });
        } else {
          // Resubscribe
          await pool.query(
            'UPDATE newsletter SET subscribed = TRUE, subscribed_at = NOW(), unsubscribed_at = NULL WHERE email = ?',
            [email]
          );
          return res.json({ message: 'Successfully resubscribed to our newsletter!' });
        }
      }

      // Create new subscription
      await pool.query('INSERT INTO newsletter (email) VALUES (?)', [email]);

      res.status(201).json({ message: 'Successfully subscribed to our newsletter!' });
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }
);

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post(
  '/unsubscribe',
  [body('email').isEmail().withMessage('Please provide a valid email')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email } = req.body;
      const pool = getPool();

      const [subscription] = await pool.query('SELECT * FROM newsletter WHERE email = ?', [email]);
      if (subscription.length === 0) {
        return res.status(404).json({ message: 'Email not found in our newsletter list' });
      }

      await pool.query(
        'UPDATE newsletter SET subscribed = FALSE, unsubscribed_at = NOW() WHERE email = ?',
        [email]
      );

      res.json({ message: 'Successfully unsubscribed from our newsletter' });
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }
);

module.exports = router;
