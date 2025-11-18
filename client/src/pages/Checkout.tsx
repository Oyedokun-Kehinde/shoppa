import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { MapPin, CreditCard, Package, ArrowRight, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [processing, setProcessing] = useState(false);

  // Require authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  const total = getTotalPrice();
  // Shipping: 5% of cart value, min ₦3,000, max ₦10,000, free over ₦200,000
  const calculateShipping = () => {
    if (total >= 200000) return 0; // Free shipping
    const percentage = total * 0.05;
    return Math.min(Math.max(percentage, 3000), 10000); // Between ₦3,000 and ₦10,000
  };
  const shippingPrice = calculateShipping();
  const taxPrice = total * 0.075; // 7.5% VAT (Nigerian standard)
  const totalPrice = total + shippingPrice + taxPrice;

  const onSubmit = async (data: any) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
      // Validate user email
      if (!user?.email) {
        toast.error('User email is required for payment');
        setProcessing(false);
        return;
      }

      // Create order
      const orderData = {
        orderItems: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id,
        })),
        shippingAddress: {
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: 'Paystack',
        itemsPrice: total,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      console.log('Creating order with data:', orderData);
      const orderResponse = await api.post('/orders', orderData);
      console.log('Order created:', orderResponse.data);
      const order = orderResponse.data;

      // Initialize Paystack payment
      console.log('Initializing Paystack with:', {
        orderId: order._id || order.id,
        email: user?.email,
        amount: totalPrice
      });
      
      const paymentResponse = await api.post('/orders/paystack/initialize', {
        orderId: order._id || order.id,
        email: user?.email,
        amount: totalPrice,
      });
      
      console.log('Paystack initialized:', paymentResponse.data);

      // Load Paystack inline script if not already loaded
      if (!window.PaystackPop) {
        console.log('Loading Paystack script...');
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('Paystack script loaded successfully');
            resolve(true);
          };
          script.onerror = () => {
            console.error('Failed to load Paystack script');
            reject(new Error('Failed to load Paystack script'));
          };
        });
      }

      // Verify Paystack is available
      if (!window.PaystackPop) {
        throw new Error('Paystack library not available');
      }

      console.log('Setting up Paystack popup with reference:', paymentResponse.data.reference);

      // Open Paystack popup
      const handler = window.PaystackPop.setup({
        key: 'pk_test_97ea3775550f1bd74cdaa1818a57b6a280f177e8', // Paystack Test Public Key
        email: user.email,
        amount: Math.round(totalPrice * 100), // Convert to kobo
        ref: paymentResponse.data.reference,
        currency: 'NGN',
        metadata: {
          orderId: order._id || order.id,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: String(order._id || order.id)
            }
          ]
        },
        onClose: function() {
          console.log('Payment popup closed');
          toast.error('Payment cancelled');
          setProcessing(false);
        },
        callback: function(response: any) {
          console.log('Payment callback received:', response);
          console.log('Payment reference:', response.reference);
          
          // Handle verification asynchronously but callback itself is sync
          api.post('/orders/paystack/verify', {
            reference: response.reference,
          })
          .then((verifyResponse) => {
            console.log('✅ Payment verified successfully:', verifyResponse.data);
            toast.success('Payment successful! 🎉', {
              duration: 5000,
              icon: '✅'
            });
            clearCart();
            setProcessing(false);
            // Navigate after a short delay to show success message
            setTimeout(() => {
              navigate(`/orders/${order._id || order.id}`);
            }, 1000);
          })
          .catch((error: any) => {
            console.error('❌ Payment verification error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            // Only show error if it's not a network issue during navigation
            if (error.response?.status !== 404) {
              toast.error(error.response?.data?.message || 'Payment verification failed. Please contact support.', {
                duration: 6000
              });
            }
            setProcessing(false);
          });
        },
      });

      console.log('Opening Paystack iframe...');
      handler.openIframe();
    } catch (error: any) {
      console.error('Checkout error:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Checkout failed. Please try again.');
      setProcessing(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-dark mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Information */}
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Street Address</label>
                    <input
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className="input-field"
                      placeholder="123 Main St"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">City</label>
                    <input
                      type="text"
                      {...register('city', { required: 'City is required' })}
                      className="input-field"
                      placeholder="Lagos"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message as string}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Postal Code</label>
                    <input
                      type="text"
                      {...register('postalCode', { required: 'Postal code is required' })}
                      className="input-field"
                      placeholder="100001"
                    />
                    {errors.postalCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.postalCode.message as string}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Country</label>
                    <input
                      type="text"
                      {...register('country', { required: 'Country is required' })}
                      className="input-field"
                      placeholder="Nigeria"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country.message as string}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Payment Method</h2>
                </div>

                <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200">
                  <div className="bg-primary px-4 py-2 rounded-lg">
                    <svg className="h-8 w-20" viewBox="0 0 200 50" fill="white">
                      <text x="10" y="35" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif">
                        Paystack
                      </text>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-dark flex items-center">
                      <Shield className="h-4 w-4 text-green-600 mr-2" />
                      Secure Payment with Paystack
                    </p>
                    <p className="text-sm text-gray-600">💳 Card • 🏦 Bank Transfer • 📱 USSD • 💰 Mobile Money</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="btn-primary w-full inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Order Summary</h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `₦${shippingPrice.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5% VAT)</span>
                  <span>₦{taxPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-dark pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {shippingPrice === 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold">🎉 Free shipping on orders over ₦200,000!</p>
                </div>
              )}
              {total < 200000 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 Spend ₦{(200000 - total).toLocaleString()} more for free shipping!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
