import { Search, ShoppingCart, CreditCard, Truck, CheckCircle, Package, UserCheck, Shield } from 'lucide-react';
import PageHero from '../components/PageHero';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="h-12 w-12" />,
      title: 'Browse & Discover',
      description: 'Explore our wide range of premium products across multiple categories. Use filters and search to find exactly what you need.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: <ShoppingCart className="h-12 w-12" />,
      title: 'Add to Cart',
      description: 'Select your desired products and add them to your cart. You can review, edit quantities, or remove items anytime.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: <UserCheck className="h-12 w-12" />,
      title: 'Login or Register',
      description: 'Create a free account or log in to proceed with your purchase. Your information is securely stored for future orders.',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: <CreditCard className="h-12 w-12" />,
      title: 'Secure Checkout',
      description: 'Enter your delivery details and select your preferred payment method. All transactions are secured with industry-standard encryption.',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      icon: <Package className="h-12 w-12" />,
      title: 'Order Processing',
      description: 'Once payment is confirmed, we immediately process your order. You\'ll receive a confirmation email with your order details.',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      icon: <Truck className="h-12 w-12" />,
      title: 'Fast Delivery',
      description: 'Track your order in real-time as it makes its way to you. Delivery typically takes 2-5 business days within Nigeria.',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  ];

  const features = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Secure Shopping',
      description: 'Your data and transactions are protected with bank-level encryption.',
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: 'Quality Guaranteed',
      description: 'All products are verified for authenticity and quality before shipping.',
    },
    {
      icon: <Truck className="h-10 w-10" />,
      title: 'Fast Shipping',
      description: 'Quick and reliable delivery across Nigeria with real-time tracking.',
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: 'Flexible Payment',
      description: 'Multiple payment options including cards, bank transfer, and pay on delivery.',
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

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            Shopping Made Simple
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            At Shoppa, we've designed our platform to make online shopping as easy and enjoyable as possible. 
            Follow these simple steps to get your favorite products delivered right to your doorstep in Akure, 
            Ondo State, and across Nigeria.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? '' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step Number and Icon */}
                <div className="flex-shrink-0">
                  <div className={`relative ${step.bgColor} rounded-2xl p-8 shadow-lg`}>
                    <div className="absolute -top-4 -left-4 bg-dark text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl">
                      {index + 1}
                    </div>
                    <div className={step.iconColor}>
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="card p-8 hover:shadow-2xl transition-shadow">
                    <h3 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting Line (except last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-20 bg-gradient-to-b from-primary/30 to-transparent"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Features */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Why Shop With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We go the extra mile to ensure your shopping experience is exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of satisfied customers across Nigeria
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/shop"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl inline-block"
            >
              Browse Products
            </a>
            <a
              href="/register"
              className="bg-dark text-white px-8 py-4 rounded-lg font-semibold hover:bg-dark-light transition-colors shadow-xl inline-block"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-dark mb-6">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Check out our FAQ page or contact our support team for assistance
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/faqs"
              className="btn-primary inline-block"
            >
              View FAQs
            </a>
            <a
              href="/contact"
              className="btn-secondary inline-block"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
