import express from 'express';
import { body, validationResult } from 'express-validator';
import Newsletter from '../models/Newsletter.js';

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

      // Check if email already exists
      const existingSubscription = await Newsletter.findOne({ email });
      if (existingSubscription) {
        if (existingSubscription.subscribed) {
          return res.status(400).json({ message: 'This email is already subscribed to our newsletter' });
        } else {
          // Resubscribe
          existingSubscription.subscribed = true;
          existingSubscription.subscribedAt = Date.now();
          await existingSubscription.save();
          return res.json({ message: 'Successfully resubscribed to our newsletter!' });
        }
      }

      // Create new subscription
      await Newsletter.create({ email });

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

      const subscription = await Newsletter.findOne({ email });
      if (!subscription) {
        return res.status(404).json({ message: 'Email not found in our newsletter list' });
      }

      subscription.subscribed = false;
      await subscription.save();

      res.json({ message: 'Successfully unsubscribed from our newsletter' });
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
    }
  }
);

export default router;
