import { useState, useEffect } from 'react';
import { X, Sparkles, TrendingUp, Gift, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModalContent {
  type: 'newProducts' | 'hotDeals' | 'trending' | 'ctaBuy' | 'featured';
  icon: any;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState(0);

  // Dynamic modal content options
  const modalContents: ModalContent[] = [
    {
      type: 'newProducts',
      icon: Sparkles,
      badge: 'New Arrivals',
      title: 'Fresh Collection Just Landed!',
      subtitle: 'Discover Our Latest Products',
      description: 'Explore premium quality products with exclusive discounts up to 50% off. Limited time offer!',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      ctaText: 'Shop New Arrivals',
      ctaLink: '/shop'
    },
    {
      type: 'hotDeals',
      icon: Zap,
      badge: 'Hot Deals',
      title: 'Flash Sale Alert! ⚡',
      subtitle: 'Massive Discounts Today Only',
      description: 'Get up to 70% off on selected items. Don\'t miss out on these amazing deals. Shop before they\'re gone!',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800',
      ctaText: 'Grab Deals Now',
      ctaLink: '/shop'
    },
    {
      type: 'trending',
      icon: TrendingUp,
      badge: 'Trending Now',
      title: 'Most Loved Products',
      subtitle: 'What Everyone is Buying',
      description: 'Check out our bestsellers and trending items. Join thousands of satisfied customers across Nigeria!',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      ctaText: 'See What\'s Trending',
      ctaLink: '/shop'
    },
    {
      type: 'featured',
      icon: Star,
      badge: 'Premium Selection',
      title: 'Handpicked For You',
      subtitle: 'Curated Quality Products',
      description: 'Our team has selected the finest products just for you. Experience premium quality at unbeatable prices.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      ctaText: 'Explore Collection',
      ctaLink: '/shop'
    },
    {
      type: 'ctaBuy',
      icon: Gift,
      badge: 'Special Offer',
      title: 'First Order Discount!',
      subtitle: 'Welcome to Shoppa',
      description: 'New here? Get 20% off your first purchase. Use code WELCOME20 at checkout. Start shopping today!',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800',
      ctaText: 'Start Shopping',
      ctaLink: '/shop'
    }
  ];

  useEffect(() => {
    // Show modal every 60 seconds (1 minute)
    const showModal = () => {
      setIsOpen(true);
      // Rotate content
      setCurrentContent((prev) => (prev + 1) % modalContents.length);
    };

    // Show first modal after 10 seconds
    const initialTimer = setTimeout(showModal, 10000);

    // Then show every 60 seconds
    const intervalTimer = setInterval(showModal, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('shoppa-announcement-dismissed', Date.now().toString());
  };

  if (!isOpen) return null;

  const content = modalContents[currentContent];
  const Icon = content.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
          aria-label="Close announcement"
        >
          <X className="h-5 w-5 text-dark" />
        </button>

        {/* Content */}
        <div className="relative">
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={content.image}
              alt={content.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider">{content.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                {content.title}
              </h2>
            </div>
          </div>

          {/* Text Section */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-dark mb-3">
              {content.subtitle}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={content.ctaLink}
                onClick={handleClose}
                className="btn-primary flex-1 text-center"
              >
                {content.ctaText}
              </Link>
              <button
                onClick={handleClose}
                className="btn-outline flex-1"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              💡 New offers appear every minute
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
