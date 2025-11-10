import { Package, Users, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { icon: <DollarSign className="h-8 w-8" />, label: 'Total Revenue', value: '$45,231', change: '+12.5%' },
    { icon: <Users className="h-8 w-8" />, label: 'Total Customers', value: '1,234', change: '+8.2%' },
    { icon: <Package className="h-8 w-8" />, label: 'Total Orders', value: '567', change: '+23.1%' },
    { icon: <TrendingUp className="h-8 w-8" />, label: 'Conversion Rate', value: '3.2%', change: '+2.4%' },
  ];

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', amount: 299.99, status: 'Delivered', date: '2024-01-15' },
    { id: 'ORD002', customer: 'Jane Smith', amount: 189.99, status: 'Processing', date: '2024-01-15' },
    { id: 'ORD003', customer: 'Bob Johnson', amount: 449.98, status: 'Shipped', date: '2024-01-14' },
    { id: 'ORD004', customer: 'Alice Brown', amount: 129.99, status: 'Pending', date: '2024-01-14' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-dark mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {stat.icon}
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-dark">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Orders</h2>
              <button className="text-primary hover:text-primary-dark font-semibold">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Amount</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-b-0">
                      <td className="py-3 px-2 font-medium">{order.id}</td>
                      <td className="py-3 px-2">{order.customer}</td>
                      <td className="py-3 px-2 font-semibold text-primary">${order.amount}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn-primary w-full">Add New Product</button>
                <button className="btn-secondary w-full">Manage Inventory</button>
                <button className="btn-outline w-full">View Analytics</button>
                <button className="btn-outline w-full">Customer Support</button>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-2xl font-bold mb-6">Top Products</h2>
              <div className="space-y-4">
                {['Wireless Headphones', 'Smart Watch Pro', 'Designer Bag'].map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{product}</p>
                      <p className="text-sm text-gray-600">{120 - index * 20} sales</p>
                    </div>
                    <div className="text-primary font-semibold">
                      ${(299.99 - index * 50).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
