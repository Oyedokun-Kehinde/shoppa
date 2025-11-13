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

    res.status(201).json({ _id: orderId, id: orderId, message: 'Order created' });
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

// @route   POST /api/orders/paystack/initialize
// @desc    Initialize Paystack payment
// @access  Private
router.post('/paystack/initialize', protect, async (req, res) => {
  try {
    const { orderId, email, amount } = req.body;
    
    // Initialize Paystack payment
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100), // Convert to kobo
        callback_url: `${process.env.CLIENT_URL}/orders/${orderId}`,
        metadata: {
          orderId,
          userId: req.user.id
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference
    });
  } catch (error) {
    console.error('Paystack initialize error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment initialization failed', 
      error: error.response?.data?.message || error.message 
    });
  }
});

// @route   POST /api/orders/paystack/verify
// @desc    Verify Paystack payment
// @access  Private
router.post('/paystack/verify', protect, async (req, res) => {
  try {
    const { reference } = req.body;
    
    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { data } = response.data;
    
    if (data.status === 'success') {
      const pool = getPool();
      const orderId = data.metadata.orderId;
      
      // Update order as paid
      await pool.query(
        `UPDATE orders SET is_paid = 1, paid_at = NOW(), payment_result = ? WHERE id = ?`,
        [JSON.stringify(data), orderId]
      );

      res.json({ 
        message: 'Payment verified successfully',
        order: orderId
      });
    } else {
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Paystack verify error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Payment verification failed', 
      error: error.response?.data?.message || error.message 
    });
  }
});

module.exports = router;
