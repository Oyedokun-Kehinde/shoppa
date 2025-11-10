import { Phone, Mail, MapPin } from 'lucide-react';

const TopHeader = () => {
  return (
    <div className="bg-dark text-white py-2 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4">
            <a href="tel:+2348012345678" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" />
              <span>+234 801 234 5678</span>
            </a>
            <a href="mailto:support@shoppa.com" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Mail className="h-3 w-3" />
              <span>support@shoppa.com</span>
            </a>
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <span>Free Shipping on Orders Over $50!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
