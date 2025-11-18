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
      query += ' AND category = $' + (params.length + 1);
      params.push(category);
    }

    if (search) {
      query += ' AND name ILIKE $' + (params.length + 1);
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const { rows: products } = await pool.query(query, params);
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
    const { rows: products } = await pool.query(
      'SELECT * FROM products WHERE slug = $1',
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
    const { rows: products } = await pool.query(
      'SELECT * FROM products WHERE id = $1',
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
    const { rows: reviews } = await pool.query(
      `SELECT pr.*, u.name as user_name 
       FROM product_reviews pr 
       JOIN users u ON pr.user_id = u.id 
       WHERE pr.product_id = $1 
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
    const { rows: existing } = await pool.query(
      'SELECT id FROM product_reviews WHERE product_id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Insert review
    await pool.query(
      'INSERT INTO product_reviews (product_id, user_id, rating, title, comment) VALUES ($1, $2, $3, $4, $5)',
      [req.params.id, req.user.id, rating, title, comment]
    );

    // Update product rating
    const { rows: reviews } = await pool.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM product_reviews WHERE product_id = $1',
      [req.params.id]
    );

    await pool.query(
      'UPDATE products SET rating = $1, num_reviews = $2 WHERE id = $3',
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

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { rows: [result] } = await pool.query(
      'INSERT INTO products (name, slug, description, price, category, image, stock) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, slug, description, price, category, image, stock || 0]
    );

    res.status(201).json(result);
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

    const { rows: products } = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, image = $5, stock = $6 WHERE id = $7 RETURNING *',
      [name, description, price, category, image, stock, req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

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
    
    const { rowCount } = await pool.query(
      'DELETE FROM products WHERE id = $1',
      [req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
