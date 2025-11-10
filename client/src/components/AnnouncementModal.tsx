import { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has dismissed modal before
    const dismissed = localStorage.getItem('shoppa-announcement-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    // Show modal if not dismissed or if 7 days have passed
    if (!dismissed || daysSinceDismissed > 7) {
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('shoppa-announcement-dismissed', Date.now().toString());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          aria-label="Close announcement"
        >
          <X className="h-5 w-5 text-dark" />
        </button>

        {/* Content */}
        <div className="relative">
          {/* Image Section */}
          <div className="relative h-64 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
              alt="New Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold uppercase tracking-wider">New Arrivals</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Exclusive Collection
              </h2>
            </div>
          </div>

          {/* Text Section */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-dark mb-3">
              Discover Our Latest Products
            </h3>
            <p className="text-gray-600 mb-6">
              Get exclusive access to premium products with up to <span className="font-bold text-primary">50% off</span> on your first order. 
              Limited time offer!
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/shop"
                onClick={handleClose}
                className="btn-primary flex-1 text-center"
              >
                Shop Now
              </Link>
              <button
                onClick={handleClose}
                className="btn-outline flex-1"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              This popup won't show again for 7 days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
