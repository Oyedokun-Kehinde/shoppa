const express = require('express');
const { getPool } = require('../config/database');
const { protect } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, total_price, shipping_price, tax_price, 
       shipping_address_address, shipping_address_city, shipping_address_postal_code, 
       shipping_address_country, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        totalPrice,
        shippingPrice,
        taxPrice,
        shippingAddress.address,
        shippingAddress.city,
        shippingAddress.postalCode,
        shippingAddress.country,
        paymentMethod
      ]
    );

    const orderId = result.insertId;

    // Insert order items
    for (const item of orderItems) {
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, name, quantity, image, price) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product, item.name, item.quantity, item.image, item.price]
      );
    }

    res.status(201).json({ id: orderId, message: 'Order created' });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const pool = getPool();
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Additional order routes (Payment, Admin) will be implemented later
// For now, basic create and list orders work

module.exports = router;
