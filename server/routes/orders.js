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
    console.log('📦 Creating order for user:', req.user?.id);
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    
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
      console.error('❌ No order items provided');
      return res.status(400).json({ message: 'No order items' });
    }

    if (!req.user || !req.user.id) {
      console.error('❌ User not authenticated');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('✅ Order validation passed');
    console.log('📦 Inserting order into database...');

    const pool = getPool();
    const { rows: [result] } = await pool.query(
      `INSERT INTO orders (user_id, total_price, shipping_price, tax_price, 
       shipping_address_address, shipping_address_city, shipping_address_postal_code, 
       shipping_address_country, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
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

    const orderId = result.id;
    console.log('✅ Order created with ID:', orderId);

    // Insert order items
    console.log(`📦 Inserting ${orderItems.length} order items...`);
    for (const item of orderItems) {
      console.log('  - Item:', item.name, 'Product ID:', item.product);
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, name, quantity, image, price) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [orderId, item.product, item.name, item.quantity, item.image, item.price]
      );
    }

    console.log('✅ Order items inserted successfully');
    res.status(201).json({ _id: orderId, id: orderId, message: 'Order created' });
  } catch (error) {
    console.error('❌ Create order error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const pool = getPool();
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
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
    const { rows: orders } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];

    // Get order items
    const { rows: items } = await pool.query(
      'SELECT * FROM order_items WHERE order_id = $1',
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
    
    console.log('========================================');
    console.log('🔍 Verifying payment with reference:', reference);
    console.log('User ID:', req.user.id);
    console.log('Paystack Secret Key exists:', !!process.env.PAYSTACK_SECRET_KEY);
    console.log('Paystack Secret Key length:', process.env.PAYSTACK_SECRET_KEY?.length);
    console.log('========================================');
    
    if (!reference) {
      console.error('❌ No reference provided');
      return res.status(400).json({ message: 'Payment reference is required' });
    }
    
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('❌ PAYSTACK_SECRET_KEY not configured!');
      return res.status(500).json({ message: 'Payment system not configured' });
    }
    
    // Verify payment with Paystack
    console.log('📡 Calling Paystack API...');
    console.log('📡 URL:', `https://api.paystack.co/transaction/verify/${reference}`);
    
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    console.log('📥 Paystack API response status:', response.data.status);
    console.log('📥 Paystack API response:', JSON.stringify(response.data, null, 2));
    
    const { data } = response.data;
    
    if (data.status === 'success') {
      console.log('✅ Payment status is SUCCESS');
      
      let orderId = data.metadata?.orderId || data.metadata?.order_id;
      
      // Check custom_fields if orderId not found
      if (!orderId && data.metadata?.custom_fields && Array.isArray(data.metadata.custom_fields)) {
        const orderField = data.metadata.custom_fields.find(f => f.variable_name === 'order_id');
        if (orderField) {
          orderId = orderField.value;
        }
      }
      
      console.log('🔑 Order ID from metadata:', orderId);
      console.log('📦 Full metadata:', JSON.stringify(data.metadata, null, 2));
      
      if (!orderId) {
        console.error('❌ Order ID not found in metadata');
        console.error('Available metadata:', data.metadata);
        return res.status(400).json({ 
          message: 'Order ID not found in payment metadata',
          metadata: data.metadata 
        });
      }
      
      console.log('📊 Getting database pool...');
      const pool = getPool();
      
      if (!pool) {
        console.error('❌ Database pool is null or undefined!');
        return res.status(500).json({ message: 'Database connection error' });
      }
      
      console.log('✅ Database pool obtained');
      console.log('🔍 Checking if order exists...');
      
      // Check if order exists and belongs to user
      const { rows: existingOrders } = await pool.query(
        'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
        [orderId, req.user.id]
      );
      
      console.log('📊 Query result - found', existingOrders.length, 'orders');

      if (existingOrders.length === 0) {
        console.error('❌ Order not found or does not belong to user');
        return res.status(404).json({ message: 'Order not found' });
      }

      console.log('📝 Updating order as paid...');
      console.log('📝 Order ID to update:', orderId, 'Type:', typeof orderId);
      console.log('📝 User ID:', req.user.id);
      
      // Convert orderId to number if it's a string
      const orderIdNumber = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
      
      console.log('📝 Converted Order ID:', orderIdNumber, 'Type:', typeof orderIdNumber);
      
      // Update order as paid
      const { rowCount: updateResult } = await pool.query(
        `UPDATE orders SET is_paid = true, paid_at = NOW(), payment_result = $1 WHERE id = $2`,
        [JSON.stringify(data), orderIdNumber]
      );

      console.log('✅ Order update result:', updateResult);
      console.log('✅ Affected rows:', updateResult);
      
      if (updateResult === 0) {
        console.error('⚠️ WARNING: No rows were updated! Order may not exist or is already paid.');
      } else {
        console.log('✅ Order', orderIdNumber, 'marked as PAID successfully');
      }
      console.log('========================================');

      res.json({ 
        success: true,
        message: 'Payment verified and order updated successfully',
        orderId: orderId,
        amount: data.amount / 100, // Convert from kobo to naira
        reference: reference
      });
    } else {
      console.error('❌ Payment status not success:', data.status);
      console.error('Payment data:', data);
      res.status(400).json({ 
        message: 'Payment was not successful', 
        status: data.status,
        paymentData: data
      });
    }
  } catch (error) {
    console.error('========================================');
    console.error('❌ PAYMENT VERIFICATION ERROR');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error config:', error.config);
    console.error('Is Axios Error:', error.isAxiosError);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('========================================');
    
    // Send detailed error in development
    res.status(500).json({ 
      success: false,
      message: 'Payment verification failed due to server error', 
      error: error.message,
      details: error.response?.data?.message || error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   PATCH /api/orders/:id/mark-paid
// @desc    Manually mark order as paid (for testing/admin)
// @access  Private
router.patch('/:id/mark-paid', protect, async (req, res) => {
  try {
    const pool = getPool();
    
    console.log('🔧 Manually marking order as paid:', req.params.id);
    
    // Check if order exists and belongs to user
    const { rows: existingOrders } = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (existingOrders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order as paid
    await pool.query(
      `UPDATE orders SET is_paid = true, paid_at = NOW() WHERE id = $1`,
      [req.params.id]
    );

    console.log('✅ Order', req.params.id, 'manually marked as PAID');

    res.json({ 
      message: 'Order marked as paid successfully',
      orderId: req.params.id
    });
  } catch (error) {
    console.error('Mark paid error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
