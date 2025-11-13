import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Package, Headphones, TrendingUp, Quote, ShoppingCart, Heart, Truck, Shield, Award } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import toast from 'react-hot-toast';
import AnimatedCounter from '../components/AnimatedCounter';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    addItem(product);
    toast.success('Added to cart!');
  };

  const toggleWishlist = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({ _id: product.id, product, addedAt: new Date().toISOString() });
      toast.success('Added to wishlist!');
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setSubscribing(true);
    try {
      const response = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      toast.success(response.data.message || 'Successfully subscribed!');
      setNewsletterEmail('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const featuredProducts = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      slug: 'premium-wireless-headphones',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
      rating: 4.8,
      stock: 50,
    },
    {
      id: '2',
      name: 'Designer Leather Bag',
      slug: 'designer-leather-bag',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
      category: 'Fashion',
      rating: 4.7,
      stock: 30,
    },
    {
      id: '3',
      name: 'Smart Watch Pro',
      slug: 'smart-watch-pro',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      category: 'Electronics',
      rating: 4.9,
      stock: 25,
    },
    {
      id: '4',
      name: 'Athletic Sneakers',
      slug: 'athletic-sneakers',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      category: 'Fashion',
      rating: 4.6,
      stock: 60,
    },
  ];

  const features = [
    {
      icon: <Truck className="h-10 w-10" />,
      title: 'Fast & Free Shipping',
      description: 'Free shipping on all orders over $50 with delivery in 2-3 business days',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Secure Payments',
      description: '100% secure transactions with Paystack and industry-leading encryption',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: '24/7 Support',
      description: 'Dedicated customer service team ready to help you anytime, anywhere',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: <Package className="h-10 w-10" />,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy on all purchases, no questions asked',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  const testimonials = [
    {
      name: 'Adewale Ogunleye',
      role: 'Fashion Enthusiast, Akure',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      content: 'Shoppa has completely transformed my shopping experience. The quality of products is exceptional, and the customer service is outstanding! Delivery to Akure was super fast.',
      rating: 5,
    },
    {
      name: 'Funmilayo Adeyemi',
      role: 'Tech Professional, Ondo State',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      content: 'I love the variety and quality of electronics available. Fast shipping to Akure and great prices make this my go-to store for all tech purchases.',
      rating: 5,
    },
    {
      name: 'Oluwaseun Babatunde',
      role: 'Business Owner, Akure',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      content: 'The product range is amazing! I\'ve equipped my entire office with items from Shoppa. Highly recommend to everyone in Akure and beyond!',
      rating: 5,
    },
  ];

  const stats = [
    { icon: <ShoppingBag className="h-8 w-8" />, number: 50000, suffix: '+', label: 'Products Sold' },
    { icon: <Star className="h-8 w-8" />, number: 4.9, suffix: '/5', label: 'Customer Rating', isDecimal: true },
    { icon: <TrendingUp className="h-8 w-8" />, number: 10000, suffix: '+', label: 'Happy Customers' },
    { icon: <Award className="h-8 w-8" />, number: 99, suffix: '%', label: 'Satisfaction Rate' },
  ];

  const categories = [
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500', count: '200+' },
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500', count: '300+' },
    { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', count: '150+' },
    { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500', count: '100+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features Section - Enhanced */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Why Shop With Us?</h2>
            <p className="text-gray-600 text-lg">Experience the difference with our premium service</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-dark">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our diverse range of premium products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/shop?category=${category.name}`}
                className="group relative overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-1">{category.name}</h3>
                  <p className="text-gray-200 text-sm">{category.count} Products</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Discover our handpicked selection of premium items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="card overflow-hidden group hover:shadow-xl transition-all duration-300 relative"
              >
                <Link to={`/product/${product.slug}`} className="block">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      New
                    </div>
                    {/* Quick Action Icons */}
                    <div className="absolute top-4 left-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-white p-2 rounded-full shadow-lg hover:bg-primary hover:text-white transition-all"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(e) => toggleWishlist(product, e)}
                        className={`bg-white p-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-all ${
                          isInWishlist(product.id) ? 'bg-red-500 text-white' : ''
                        }`}
                        title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">${product.price}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/shop" className="btn-primary inline-flex items-center space-x-2">
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} duration={2500} />
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="card p-8 hover:shadow-xl transition-all duration-300 relative"
              >
                <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-dark">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Subscribe to get exclusive offers, early access to sales, and style tips directly in your inbox
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={subscribing}
                className="flex-1 px-6 py-4 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="bg-primary hover:bg-primary-dark px-8 py-4 rounded-lg font-semibold transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            <p className="text-sm text-gray-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your account today and get exclusive access to member-only deals and personalized recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary">
              Create Account
            </Link>
            <Link to="/shop" className="btn-outline">
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
