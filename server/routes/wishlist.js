import express from 'express';
import Wishlist from '../models/Wishlist.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, items: [] });
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/wishlist
// @desc    Add item to wishlist
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user.id,
        items: [{ product: productId }],
      });
    } else {
      // Check if product already in wishlist
      const alreadyExists = wishlist.items.some(
        (item) => item.product.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }

      wishlist.items.push({ product: productId });
      await wishlist.save();
    }

    await wishlist.populate('items.product');
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete('/:productId', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('items.product');

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/wishlist
// @desc    Clear wishlist
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = [];
    await wishlist.save();

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
