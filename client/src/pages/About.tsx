import { Target, Users, TrendingUp, Award, Linkedin, Twitter, Mail } from 'lucide-react';

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

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      bio: 'Visionary leader with 15+ years in e-commerce',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'sarah@shoppa.com',
      },
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Expert in supply chain and logistics management',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'michael@shoppa.com',
      },
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Success Lead',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      bio: 'Passionate about creating exceptional customer experiences',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'emily@shoppa.com',
      },
    },
    {
      name: 'David Park',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      bio: 'Tech innovator driving our digital transformation',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'david@shoppa.com',
      },
    },
    {
      name: 'Lisa Anderson',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
      bio: 'Creative strategist with a passion for brand storytelling',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'lisa@shoppa.com',
      },
    },
    {
      name: 'James Wilson',
      role: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      bio: 'Data-driven product expert focused on user experience',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'james@shoppa.com',
      },
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-dark via-dark-light to-dark text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">About Shoppa</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
            We're on a mission to revolutionize online shopping by providing premium products with exceptional service
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-4xl font-bold text-dark mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
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
            <div className="order-1 md:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                  alt="Our Story"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-8 rounded-xl shadow-xl">
                <div className="text-5xl font-bold mb-1">5+</div>
                <div className="text-sm opacity-90">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">Vision & Mission</h2>
            <p className="text-xl text-gray-600">
              Guiding our path to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Vision */}
            <div className="card p-10 hover:shadow-2xl transition-all duration-300 border-t-4 border-primary">
              <div className="flex items-center mb-6">
                <div className="bg-primary/10 p-4 rounded-xl">
                  <Target className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-dark ml-4">Our Vision</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become Nigeria's leading e-commerce platform, setting the standard for quality, 
                accessibility, and customer satisfaction. We envision a future where every Nigerian, 
                from Akure to Lagos, can access premium products with ease, delivered right to their doorstep 
                with exceptional service.
              </p>
            </div>

            {/* Mission */}
            <div className="card p-10 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-600">
              <div className="flex items-center mb-6">
                <div className="bg-blue-50 p-4 rounded-xl">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-3xl font-bold text-dark ml-4">Our Mission</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower Nigerian consumers by providing a seamless online shopping experience 
                with authentic products, competitive prices, and reliable delivery. We are committed 
                to supporting local businesses while bringing the world's best products to your doorstep, 
                serving Akure, Ondo State, and all of Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="py-24 bg-gradient-to-r from-dark via-gray-900 to-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Commitment to You</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We pledge to uphold the highest standards in every aspect of our business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Commitment 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Customer-Centric Service</h3>
              <p className="text-gray-300 leading-relaxed">
                Your satisfaction is our priority. We guarantee responsive customer support, 
                easy returns, and a shopping experience that exceeds your expectations. From Akure 
                to every corner of Nigeria, we're here for you 24/7.
              </p>
            </div>

            {/* Commitment 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Quality Assurance</h3>
              <p className="text-gray-300 leading-relaxed">
                Every product is carefully vetted for authenticity and quality. We work directly with 
                trusted manufacturers and suppliers to ensure you receive only genuine, high-quality items 
                that meet international standards.
              </p>
            </div>

            {/* Commitment 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Continuous Innovation</h3>
              <p className="text-gray-300 leading-relaxed">
                We embrace technology and innovation to improve your shopping experience. From AI-powered 
                recommendations to seamless payment options, we're constantly evolving to serve you better 
                and make online shopping effortless.
              </p>
            </div>

            {/* Commitment 4 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Fast & Reliable Delivery</h3>
              <p className="text-gray-300 leading-relaxed">
                We understand the importance of timely delivery. Our logistics network ensures your orders 
                reach you quickly and safely, whether you're in Akure, Lagos, or any part of Nigeria. 
                Track every step of your order in real-time.
              </p>
            </div>

            {/* Commitment 5 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Competitive Pricing</h3>
              <p className="text-gray-300 leading-relaxed">
                Premium quality shouldn't mean premium prices. We negotiate the best deals with suppliers 
                and pass the savings to you. Enjoy authentic products at prices that respect your budget, 
                with regular discounts and promotions.
              </p>
            </div>

            {/* Commitment 6 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all duration-300">
              <div className="bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Community Building</h3>
              <p className="text-gray-300 leading-relaxed">
                We're more than a store—we're a community. By supporting Shoppa, you're supporting local 
                Nigerian businesses, jobs, and economic growth. Together, we're building a stronger, 
                more connected Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-110 transition-transform duration-300"
              >
                <div className="text-5xl md:text-6xl font-bold mb-3">{stat.number}</div>
                <div className="text-lg md:text-xl opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 text-primary mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-dark">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Enhanced */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              The talented individuals behind Shoppa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="card overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm mb-4">{member.bio}</p>
                      <div className="flex space-x-3">
                        <a
                          href={member.social.linkedin}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5 text-white" />
                        </a>
                        <a
                          href={member.social.twitter}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="h-5 w-5 text-white" />
                        </a>
                        <a
                          href={`mailto:${member.social.email}`}
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-2 rounded-full transition-colors"
                          aria-label="Email"
                        >
                          <Mail className="h-5 w-5 text-white" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1 text-dark">{member.name}</h3>
                  <p className="text-primary font-semibold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary via-red-700 to-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Us on Our Journey
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Be part of our growing community and experience the future of e-commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/shop" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Shopping
            </a>
            <a href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
