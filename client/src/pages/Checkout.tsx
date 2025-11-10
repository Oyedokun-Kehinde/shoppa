import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { MapPin, CreditCard, Package, ArrowRight } from 'lucide-react';
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
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [processing, setProcessing] = useState(false);

  const total = getTotalPrice();
  const shippingPrice = total > 50 ? 0 : 10;
  const taxPrice = total * 0.08;
  const totalPrice = total + shippingPrice + taxPrice;

  const onSubmit = async (data: any) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setProcessing(true);

    try {
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

      const orderResponse = await api.post('/orders', orderData);
      const order = orderResponse.data;

      // Initialize Paystack payment
      const paymentResponse = await api.post('/orders/paystack/initialize', {
        orderId: order._id,
        email: user?.email,
        amount: totalPrice,
      });

      // Load Paystack inline script if not already loaded
      if (!window.PaystackPop) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Open Paystack popup
      const handler = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_97ea3775550f1bd74cdaa1818a57b6a280f177e8',
        email: user?.email,
        amount: Math.round(totalPrice * 100), // Convert to kobo
        ref: paymentResponse.data.reference,
        metadata: {
          orderId: order._id,
        },
        onClose: function() {
          toast.error('Payment cancelled');
          setProcessing(false);
        },
        callback: async function(response: any) {
          try {
            // Verify payment
            await api.post('/orders/paystack/verify', {
              reference: response.reference,
            });

            toast.success('Payment successful!');
            clearCart();
            navigate(`/orders/${order._id}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
          } finally {
            setProcessing(false);
          }
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Checkout failed. Please try again.');
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

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src="https://paystack.com/assets/logo/white.svg"
                    alt="Paystack"
                    className="h-8 bg-primary px-4 py-2 rounded"
                  />
                  <div>
                    <p className="font-semibold">Secure Payment with Paystack</p>
                    <p className="text-sm text-gray-600">Card, Bank Transfer, USSD, Mobile Money</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing || items.length === 0}
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
                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span>${taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-dark pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {shippingPrice === 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-semibold">🎉 Free shipping applied!</p>
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
