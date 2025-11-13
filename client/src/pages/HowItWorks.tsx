import { Search, ShoppingCart, CreditCard, Truck, CheckCircle, Package, UserCheck, Shield, Clock, Award, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: <Search className="h-16 w-16" />,
      title: 'Browse & Discover',
      description: 'Explore thousands of premium products across multiple categories. Use our advanced filters and smart search to find exactly what you need in seconds.',
      gradient: 'from-blue-600 via-blue-500 to-cyan-400',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop',
    },
    {
      number: '02',
      icon: <ShoppingCart className="h-16 w-16" />,
      title: 'Add to Cart',
      description: 'Select your desired products with confidence. Review items, adjust quantities, save favorites to your wishlist, and manage your cart with ease.',
      gradient: 'from-green-600 via-green-500 to-emerald-400',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&h=400&fit=crop',
    },
    {
      number: '03',
      icon: <UserCheck className="h-16 w-16" />,
      title: 'Quick Registration',
      description: 'Create your free account in under 60 seconds. Your profile is securely stored with encrypted data for seamless future orders.',
      gradient: 'from-purple-600 via-purple-500 to-pink-400',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    },
    {
      number: '04',
      icon: <CreditCard className="h-16 w-16" />,
      title: 'Secure Checkout',
      description: 'Enter delivery details and choose from multiple payment options. All transactions protected with 256-bit SSL encryption and PCI-DSS compliance.',
      gradient: 'from-yellow-600 via-yellow-500 to-orange-400',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    },
    {
      number: '05',
      icon: <Package className="h-16 w-16" />,
      title: 'Order Confirmed',
      description: 'Receive instant email confirmation with order tracking details. Watch real-time updates as your package moves through our fulfillment centers.',
      gradient: 'from-red-600 via-red-500 to-pink-400',
      image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&h=400&fit=crop',
    },
    {
      number: '06',
      icon: <Truck className="h-16 w-16" />,
      title: 'Fast Delivery',
      description: 'Track your package in real-time with GPS-enabled delivery. Receive SMS updates and enjoy delivery within 2-5 business days across Nigeria.',
      gradient: 'from-indigo-600 via-indigo-500 to-purple-400',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=600&h=400&fit=crop',
    },
  ];

  const features = [
    {
      icon: <Shield className="h-12 w-12" />,
      title: 'Bank-Level Security',
      description: '256-bit SSL encryption protects your data and transactions',
      stat: '100% Secure',
    },
    {
      icon: <CheckCircle className="h-12 w-12" />,
      title: 'Quality Guarantee',
      description: 'Every product verified for authenticity before shipping',
      stat: '99% Satisfaction',
    },
    {
      icon: <Clock className="h-12 w-12" />,
      title: '24/7 Support',
      description: 'Expert customer service team ready to assist you anytime',
      stat: 'Always Available',
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: 'Best Prices',
      description: 'Competitive pricing with regular deals and discounts',
      stat: 'Save More',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <PageHero
        title="How It Works"
        subtitle="Your seamless shopping experience in 6 simple steps"
        breadcrumbs={[{ label: 'How It Works' }]}
        bgImage="https://images.unsplash.com/photo-1556742400-b5b7f1634129?w=1200"
      />

      {/* Timeline Process Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
              Your Shopping Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From browsing to delivery, we've streamlined every step to give you a seamless experience
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${step.gradient}`}></div>
                
                {/* Step Number Badge */}
                <div className="absolute top-6 right-6 z-10">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-xl`}>
                    <span className="text-white font-bold text-xl">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">{step.icon}</div>
                  </div>

                  <h3 className="text-2xl font-bold text-dark mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Connector Arrow */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-300">
                      <ArrowRight className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Why Choose Shoppa?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing the best online shopping experience in Nigeria
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100"
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-primary to-primary-dark w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <div className="text-white">{feature.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-dark mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">{feature.description}</p>
                
                {/* Stat Badge */}
                <div className="text-center">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                    {feature.stat}
                  </span>
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-dark"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Seamless Shopping?
            </h2>
            <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
              Join over 10,000 satisfied customers who trust Shoppa for their online shopping needs across Nigeria
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                to="/shop"
                className="group bg-white text-primary px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Start Shopping Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="bg-dark text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-dark-light transition-all duration-300 shadow-2xl hover:scale-105 inline-block"
              >
                Create Free Account
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-white/20">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-white/80">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-white/80">Products</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99%</div>
                <div className="text-white/80">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
