import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { Package, ShoppingBag, Heart, Settings, User, MapPin, CreditCard, Truck, CheckCircle, Clock, XCircle, Download, FileText, Receipt as ReceiptIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import Receipt from '../../components/Receipt';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: 'Nigeria',
    zipCode: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/myorders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Pending':
        return <Package className="h-5 w-5 text-gray-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Calculate total spent from PAID orders only, using correct database field names
  const totalSpent = orders.reduce((sum: number, o: any) => {
    // Only count paid orders (is_paid === 1 or true)
    if (o.is_paid) {
      const amount = parseFloat(o.total_price || o.totalPrice || 0);
      return sum + amount;
    }
    return sum;
  }, 0);
  
  // Active orders = Paid orders that are NOT delivered
  const activeOrders = orders.filter((o: any) => o.is_paid && o.status !== 'Delivered');
  
  const stats = [
    { icon: <Package className="h-8 w-8" />, label: 'Total Orders', value: orders.length.toString(), color: 'bg-blue-50 text-blue-600' },
    { icon: <ShoppingBag className="h-8 w-8" />, label: 'Active Orders', value: activeOrders.length.toString(), color: 'bg-green-50 text-green-600' },
    { icon: <Heart className="h-8 w-8" />, label: 'Wishlist', value: wishlistItems.length.toString(), color: 'bg-pink-50 text-pink-600' },
    { icon: <CreditCard className="h-8 w-8" />, label: 'Total Spent', value: `₦${totalSpent.toLocaleString()}`, color: 'bg-purple-50 text-purple-600' },
  ];

  const handleViewReceipt = (order: any) => {
    setSelectedReceipt(order);
    setShowReceipt(true);
  };

  const handleDeleteFromWishlist = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDeleteFromWishlist = () => {
    if (itemToDelete) {
      useWishlistStore.getState().removeItem(itemToDelete.id);
      toast.success('Removed from wishlist');
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="h-5 w-5" /> },
    { id: 'orders', label: 'Orders', icon: <Package className="h-5 w-5" /> },
    { id: 'receipts', label: 'Receipts', icon: <ReceiptIcon className="h-5 w-5" /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart className="h-5 w-5" /> },
    { id: 'addresses', label: 'Addresses', icon: <MapPin className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your orders, wishlist, and account settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-dark">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 rounded-xl ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="card mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : (orders && orders.length > 0) ? (
                    <div className="space-y-4">
                      {(orders || []).slice(0, 3).map((order: any, idx: number) => (
                        <div key={order.id || idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status || 'Pending')}
                            <div>
                              <p className="font-semibold">Order #{order.id.toString().slice(-8)}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">₦{parseFloat(order.total_price || order.totalPrice || 0).toLocaleString()}</p>
                            <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(order.status || 'Pending')}`}>
                              {order.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No orders yet</p>
                      <Link to="/shop" className="btn-primary">
                        Start Shopping
                      </Link>
                    </div>
                  )}
                  {orders.length > 3 && (
                    <button onClick={() => setActiveTab('orders')} className="btn-outline w-full mt-4">
                      View All Orders
                    </button>
                  )}
                </div>

                {wishlistItems.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(wishlistItems || []).slice(0, 4).map((item: any) => (
                        <Link
                          key={item.id}
                          to={`/shop`}
                          className="card overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="p-3">
                            <h3 className="font-semibold text-sm line-clamp-1">{item.name}</h3>
                            <p className="text-primary font-bold">₦{item.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {wishlistItems.length > 4 && (
                      <button onClick={() => setActiveTab('wishlist')} className="btn-outline w-full mt-4">
                        View All Items
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">All Orders</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (orders && orders.length > 0) ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {(orders || []).map((order: any, orderIdx: number) => (
                      <div key={order.id || orderIdx} className="card p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg mb-1">Order #{order.id.toString().slice(-8)}</h3>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <span className={`text-sm px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status || 'Pending')}`}>
                              {order.status || 'Pending'}
                            </span>
                            <span className={`text-sm px-4 py-2 rounded-full font-semibold ${
                              order.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {order.is_paid ? 'Paid' : 'Unpaid'}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="space-y-3 mb-4">
                            {(order.items || []).map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center space-x-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                <div className="flex-1">
                                  <p className="font-semibold">{item.name}</p>
                                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-bold">₦{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">
                                {order.shipping_address_city}, {order.shipping_address_country}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-primary">₦{parseFloat(order.total_price || 0).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-3">
                          <Link to={`/orders/${order.id}`} className="btn-outline flex-1 text-center">
                            View Details
                          </Link>
                          {order.is_paid && (
                            <button 
                              onClick={() => handleViewReceipt(order)}
                              className="btn-secondary flex items-center justify-center space-x-2 flex-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>Receipt</span>
                            </button>
                          )}
                          {!order.is_paid && (
                            <button 
                              onClick={() => navigate(`/orders/${order.id}`)}
                              className="btn-primary flex-1"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link to="/shop" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Receipts Tab */}
            {activeTab === 'receipts' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Payment Receipts</h2>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  <>
                    {orders.filter((o: any) => o.is_paid).length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {orders.filter((o: any) => o.is_paid).map((order: any) => (
                          <div key={order.id} className="card p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">Order #{order.id.toString().slice(-8)}</h3>
                                  <p className="text-sm text-gray-600">
                                    {new Date(order.created_at || order.createdAt).toLocaleDateString('en-NG', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </p>
                                </div>
                              </div>
                              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold">
                                Paid
                              </span>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                              <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Amount Paid:</span>
                                <span className="font-bold text-xl text-primary">
                                  ₦{parseFloat(order.total_price || order.totalPrice || 0).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Payment Date:</span>
                                <span className="font-medium">
                                  {order.paid_at ? new Date(order.paid_at).toLocaleDateString('en-NG') : 'N/A'}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleViewReceipt(order)}
                              className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                              <ReceiptIcon className="h-4 w-4" />
                              View Receipt
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">No payment receipts available</p>
                        <p className="text-sm text-gray-400 mb-6">
                          Receipts are generated after successful payment
                        </p>
                        <Link to="/shop" className="btn-primary">
                          Start Shopping
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item: any) => (
                      <div
                        key={item.id}
                        className="card overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <Link to={`/product/${item.slug || item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover"
                          />
                        </Link>
                        <div className="p-4">
                          <Link to={`/product/${item.slug || item.id}`}>
                            <h3 className="font-semibold mb-2 hover:text-primary transition-colors">{item.name}</h3>
                          </Link>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-2xl font-bold text-primary">₦{item.price.toLocaleString()}</p>
                            <button
                              onClick={() => handleDeleteFromWishlist(item)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm font-semibold"
                            >
                              <XCircle className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                    <Link to="/shop" className="btn-primary">
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Saved Addresses</h2>
                  <button onClick={() => setShowAddressModal(true)} className="btn-primary">
                    + Add New Address
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Example addresses - in real app, fetch from backend */}
                  <div className="card p-6 border-2 border-primary">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded">Default</span>
                        <h3 className="font-bold text-lg mt-2">Home</h3>
                      </div>
                      <button className="text-gray-400 hover:text-primary">
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-600">
                      {user?.name}<br />
                      123 Main Street, Alagbaka<br />
                      Akure, Ondo State 340001<br />
                      Nigeria<br />
                      Phone: +234 803 123 4567
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-sm text-primary hover:underline">Edit</button>
                      <button className="text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>

                  <div className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-lg">Office</h3>
                      <button className="text-gray-400 hover:text-primary">
                        <Settings className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-gray-600">
                      {user?.name}<br />
                      456 Business Avenue<br />
                      Ikeja, Lagos State 100001<br />
                      Nigeria<br />
                      Phone: +234 803 765 4321
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <button className="text-sm text-primary hover:underline">Edit</button>
                      <button className="text-sm text-primary hover:underline">Set as Default</button>
                      <button className="text-sm text-red-600 hover:underline">Remove</button>
                    </div>
                  </div>

                  {/* Add new address card */}
                  <div className="card p-6 border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-primary hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-semibold">Add New Address</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <div className="max-w-2xl">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue={user?.email}
                        className="input-field"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Password</label>
                      <button className="btn-outline">
                        Change Password
                      </button>
                    </div>
                    <div className="pt-4">
                      <button className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Add New Address</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); toast.success('Address saved!'); setShowAddressModal(false); }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Address Label *</label>
                    <input
                      type="text"
                      value={addressForm.label}
                      onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      placeholder="Home, Office, etc."
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      placeholder="John Doe"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    placeholder="+234 803 123 4567"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Street Address *</label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                    placeholder="123 Main Street, Alagbaka"
                    className="input-field"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">City *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="Akure"
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">State *</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="Ondo State"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Country *</label>
                    <input
                      type="text"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                      placeholder="340001"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && selectedReceipt && (
        <Receipt
          order={selectedReceipt}
          onClose={() => {
            setShowReceipt(false);
            setSelectedReceipt(null);
          }}
        />
      )}

      {/* Delete Wishlist Item Confirmation Modal */}
      {showDeleteModal && itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Remove from Wishlist?</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to remove <span className="font-semibold">"{itemToDelete.name}"</span> from your wishlist?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setItemToDelete(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFromWishlist}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
