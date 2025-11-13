import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const wishlist = useWishlistStore((state) => state.items);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-primary">SHOPPA</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-dark hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Wishlist Icon */}
            <Link to="/dashboard?tab=wishlist" className="relative">
              <Heart className="h-6 w-6 text-dark hover:text-primary transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-dark hover:text-primary transition-colors" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-dark hover:text-primary transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block font-medium">{user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                    className="block px-4 py-3 text-dark hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-3 text-dark hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-dark"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

      </div>

      {/* Off-Canvas Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[60] md:hidden animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-[70] md:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <span className="text-2xl font-bold text-primary">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block py-3 px-4 text-dark hover:bg-gray-50 hover:text-primary rounded-lg transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* User Section in Mobile */}
                <div className="mt-8 pt-6 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-sm text-gray-600">
                        Signed in as <span className="font-semibold text-dark">{user?.name}</span>
                      </div>
                      <Link
                        to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                        className="block py-3 px-4 text-dark hover:bg-gray-50 hover:text-primary rounded-lg transition-all font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left py-3 px-4 text-dark hover:bg-gray-50 hover:text-primary rounded-lg transition-all font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        className="block btn-primary text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block btn-outline text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
