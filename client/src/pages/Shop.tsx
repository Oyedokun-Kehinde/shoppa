import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import toast from 'react-hot-toast';
import api from '../lib/api';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const { addItem } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((product: any) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = product.rating >= minRating;
      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Added to cart!');
  };

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({ _id: product._id, product, addedAt: new Date().toISOString() });
      toast.success('Added to wishlist!');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange([0, 1000]);
    setMinRating(0);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl text-gray-300">Discover our complete collection of premium products</p>
          <div className="mt-6 flex items-center space-x-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full">{filteredProducts.length} Products</span>
            <span className="bg-white/20 px-4 py-2 rounded-full">{categories.length - 1} Categories</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full lg:w-48"
            >
              <option value="featured">Featured</option>
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline inline-flex items-center justify-center space-x-2 lg:w-auto"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {(selectedCategory !== 'All' || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 1000) && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">Active</span>
              )}
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 card p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary hover:text-primary-dark font-semibold">
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Price Range</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                        className="input-field w-full"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                        className="input-field w-full"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Minimum Rating</label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1, 0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(rating)}
                        className={`flex items-center space-x-2 w-full p-2 rounded-lg transition-colors ${
                          minRating === rating ? 'bg-primary text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating
                                  ? minRating === rating
                                    ? 'fill-white text-white'
                                    : 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">{rating > 0 ? `${rating}+ stars` : 'All'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Availability</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" defaultChecked />
                      <span>In Stock</span>
                    </label>
                    <label className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-5 w-5 text-primary" />
                      <span>Out of Stock</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-white text-dark hover:bg-gray-100 shadow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product: any) => (
                <div key={product._id} className="card overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <Link to={`/product/${product._id}`} className="block relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Only {product.stock} left
                      </div>
                    )}
                  </Link>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm text-gray-500">{product.category}</p>
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            isInWishlist(product._id) ? 'fill-primary text-primary' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-1 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.numReviews})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">${product.price}</p>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-dark text-white p-2.5 rounded-lg hover:bg-dark-light transition-colors"
                        title="Add to cart"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <X className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
