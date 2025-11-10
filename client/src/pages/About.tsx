import { Target, Users, TrendingUp, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '50+', label: 'Team Members' },
    { number: '99%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: <Target className="h-12 w-12" />,
      title: 'Our Mission',
      description:
        'To provide premium quality products that enhance the lifestyle of our customers while maintaining sustainable and ethical practices.',
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: 'Customer First',
      description:
        'We prioritize customer satisfaction above all else, ensuring every interaction exceeds expectations.',
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: 'Innovation',
      description:
        'Constantly evolving our product line and services to meet the changing needs of modern consumers.',
    },
    {
      icon: <Award className="h-12 w-12" />,
      title: 'Quality Assured',
      description:
        'Every product is carefully curated and tested to meet our stringent quality standards.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Shoppa</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner in premium e-commerce, delivering excellence since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Founded in 2020, Shoppa emerged from a simple vision: to create an e-commerce
                  platform that combines quality, style, and exceptional customer service.
                </p>
                <p>
                  What started as a small team of passionate individuals has grown into a thriving
                  community of creators, curators, and customers who share our commitment to
                  excellence.
                </p>
                <p>
                  Today, we serve thousands of customers worldwide, offering a carefully curated
                  selection of products that embody our values of quality, sustainability, and
                  innovation.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                alt="Our Story"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              The talented individuals behind Shoppa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' },
              { name: 'Michael Chen', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
              { name: 'Emily Rodriguez', role: 'Customer Success Lead', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400' },
            ].map((member, index) => (
              <div key={index} className="card overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
