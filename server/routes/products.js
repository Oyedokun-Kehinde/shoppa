const express = require('express');
const { getPool } = require('../config/database');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const pool = getPool();
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/slug/:slug
// @desc    Get product by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const pool = getPool();
    const [products] = await pool.query(
      'SELECT * FROM products WHERE slug = ?',
      [req.params.slug]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(products[0]);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/products/:id/reviews
// @desc    Get product reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const pool = getPool();
    const [reviews] = await pool.query(
      `SELECT pr.*, u.name as user_name 
       FROM product_reviews pr 
       JOIN users u ON pr.user_id = u.id 
       WHERE pr.product_id = ? 
       ORDER BY pr.created_at DESC`,
      [req.params.id]
    );

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create product review
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const pool = getPool();

    // Check if user already reviewed this product
    const [existing] = await pool.query(
      'SELECT id FROM product_reviews WHERE product_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Insert review
    await pool.query(
      'INSERT INTO product_reviews (product_id, user_id, rating, title, comment) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.user.id, rating, title, comment]
    );

    // Update product rating
    const [reviews] = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM product_reviews WHERE product_id = ?',
      [req.params.id]
    );

    await pool.query(
      'UPDATE products SET rating = ?, num_reviews = ? WHERE id = ?',
      [reviews[0].avg_rating, reviews[0].count, req.params.id]
    );

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    const pool = getPool();

    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, image, stock || 0]
    );

    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(products[0]);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const pool = getPool();
    const { name, description, price, category, image, stock } = req.body;

    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, stock = ? WHERE id = ?',
      [name, description, price, category, image, stock, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const [products] = await pool.query(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    res.json(products[0]);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const pool = getPool();
    
    const [result] = await pool.query(
      'DELETE FROM products WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
