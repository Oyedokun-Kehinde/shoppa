import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const TopHeader = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const promoMessages = [
    '🎉 Free Shipping on Orders Over $50!',
    '💰 Save Up to 50% on Selected Items!',
    '🚀 New Arrivals Just Dropped - Shop Now!',
    '🎁 Buy 2 Get 1 Free on All Fashion Items!',
    '⚡ Flash Sale: 24 Hours Only!',
    '🛍️ Sign Up & Get 15% Off Your First Order!',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000); // Change message every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4">
            <a href="tel:+2348123456789" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" />
              <span>+234 812 345 6789</span>
            </a>
            <a href="mailto:support@shoppa.com.ng" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Mail className="h-3 w-3" />
              <span>support@shoppa.com.ng</span>
            </a>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>Akure, Ondo State, Nigeria</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span className="inline-block animate-fade-in font-semibold">
              {promoMessages[currentMessageIndex]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
