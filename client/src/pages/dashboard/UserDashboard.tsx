import { useAuthStore } from '../../store/authStore';
import { Package, ShoppingBag, Heart, Settings } from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuthStore();

  const recentOrders = [
    { id: '1', date: '2024-01-15', total: 299.99, status: 'Delivered' },
    { id: '2', date: '2024-01-10', total: 189.99, status: 'In Transit' },
    { id: '3', date: '2024-01-05', total: 449.98, status: 'Processing' },
  ];

  const stats = [
    { icon: <Package className="h-8 w-8" />, label: 'Total Orders', value: '12' },
    { icon: <ShoppingBag className="h-8 w-8" />, label: 'Active Orders', value: '2' },
    { icon: <Heart className="h-8 w-8" />, label: 'Wishlist', value: '8' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your orders and account settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-dark">{stat.value}</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="md:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${order.total}</p>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-outline w-full mt-6">
                View All Orders
              </button>
            </div>
          </div>

          {/* Account Menu */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Account</h2>
              <div className="space-y-3">
                <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Settings</span>
                </button>
                <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Wishlist</span>
                </button>
                <button className="w-full text-left flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Orders</span>
                </button>
              </div>
            </div>

            <div className="card p-6 bg-primary text-white">
              <h3 className="text-xl font-bold mb-2">Premium Member</h3>
              <p className="text-sm opacity-90 mb-4">
                Enjoy exclusive benefits and early access to sales
              </p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
