import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, CreditCard, Truck, CheckCircle, Clock, AlertCircle, Download } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Receipt from '../components/Receipt';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case 'shipped':
        return <Truck className="h-8 w-8 text-blue-600" />;
      case 'processing':
        return <Package className="h-8 w-8 text-yellow-600" />;
      default:
        return <Clock className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:text-primary-dark mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-dark mb-2">Order Details</h1>
          <p className="text-gray-600">Order #{order.id?.toString().slice(-8) || 'N/A'}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Status Card */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(order.status)}
                  <div>
                    <h2 className="text-2xl font-bold text-dark">Order Status</h2>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-2 ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  order.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {order.is_paid ? 'Paid' : 'Unpaid'}
                </span>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Order placed on {new Date(order.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-dark mb-6">Order Items</h2>
              <div className="space-y-4">
                {(order.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center space-x-4 pb-4 border-b last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-dark">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-primary">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-dark">Shipping Address</h2>
              </div>
              <div className="text-gray-700">
                <p>{order.shipping_address_address || 'N/A'}</p>
                <p>{order.shipping_address_city || 'N/A'}, {order.shipping_address_postal_code || ''}</p>
                <p>{order.shipping_address_country || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₦{((order.total_price || 0) - (order.shipping_price || 0) - (order.tax_price || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">₦{(order.shipping_price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">₦{(order.tax_price || 0).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">₦{(order.total_price || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {!order.is_paid ? (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark mb-4">Payment Required</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Complete your payment to process this order.
                </p>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full"
                >
                  Pay Now
                </button>
              </div>
            ) : (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark mb-4">✅ Payment Completed</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Your order has been paid successfully. Download your receipt below.
                </p>
                <button
                  onClick={() => setShowReceipt(true)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download Receipt
                </button>
              </div>
            )}

            {/* Help */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4">Need Help?</h2>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for assistance with your order.
              </p>
              <button 
                onClick={() => navigate('/contact')}
                className="btn-outline w-full"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && order && (
        <Receipt
          order={order}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default OrderDetail;
