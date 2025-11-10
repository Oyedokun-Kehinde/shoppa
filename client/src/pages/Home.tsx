import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Headphones } from 'lucide-react';

const Home = () => {
  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
    },
    {
      id: '2',
      name: 'Designer Leather Bag',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      category: 'Fashion',
    },
    {
      id: '3',
      name: 'Smart Watch Pro',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      category: 'Electronics',
    },
    {
      id: '4',
      name: 'Athletic Sneakers',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      category: 'Fashion',
    },
  ];

  const features = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Free Shipping',
      description: 'On orders over $50',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Payment',
      description: '100% secure transactions',
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Dedicated customer service',
    },
    {
      icon: <ShoppingBag className="h-8 w-8" />,
      title: 'Easy Returns',
      description: '30-day return policy',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark via-dark-light to-dark text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Premium
              <span className="text-primary block">Products</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Experience quality and style with our curated collection of exceptional products.
            </p>
            <Link to="/shop" className="btn-primary inline-flex items-center space-x-2">
              <span>Shop Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-50"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Discover our handpicked selection of premium items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="card overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                    New
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Community
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Sign up today and get exclusive access to special offers, new arrivals, and more.
          </p>
          <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
