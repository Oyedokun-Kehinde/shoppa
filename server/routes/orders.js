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

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const pool = getPool();
    
    // Get order details
    const [orders] = await pool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const [items] = await pool.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [req.params.id]
    );

    // Combine order with items
    res.json({
      ...order,
      items
    });
  } catch (error) {
    console.error('Get order error:', error);
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
    
    console.log('Verifying payment with reference:', reference);
    
    if (!reference) {
      return res.status(400).json({ message: 'Payment reference is required' });
    }
    
    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    console.log('Paystack verification response:', response.data);
    const { data } = response.data;
    
    if (data.status === 'success') {
      const pool = getPool();
      const orderId = data.metadata?.orderId || data.metadata?.order_id;
      
      console.log('Payment successful, updating order:', orderId);
      
      if (!orderId) {
        console.error('Order ID not found in metadata:', data.metadata);
        return res.status(400).json({ message: 'Order ID not found in payment metadata' });
      }
      
      // Update order as paid
      await pool.query(
        `UPDATE orders SET is_paid = 1, paid_at = NOW(), payment_result = ? WHERE id = ?`,
        [JSON.stringify(data), orderId]
      );

      console.log('Order updated successfully:', orderId);

      res.json({ 
        message: 'Payment verified successfully',
        order: orderId
      });
    } else {
      console.error('Payment status not success:', data.status);
      res.status(400).json({ message: 'Payment verification failed', status: data.status });
    }
  } catch (error) {
    console.error('Paystack verify error:', error.response?.data || error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      message: 'Payment verification failed', 
      error: error.response?.data?.message || error.message 
    });
  }
});

module.exports = router;
