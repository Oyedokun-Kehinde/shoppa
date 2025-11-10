import express from 'express';
import { body, validationResult } from 'express-validator';
import { sendContactEmail } from '../utils/email.js';
import Contact from '../models/Contact.js';

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
      await Contact.create({
        name,
        email,
        subject,
        message,
      });

      // Try to send email (non-blocking)
      try {
        await sendContactEmail({
          name,
          email,
          subject,
          message,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Continue even if email fails
      }

      res.json({ message: 'Message sent successfully! We will get back to you soon.' });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
  }
);

export default router;
