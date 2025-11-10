import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addItem } = useCartStore();

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books'];

  const products = [
    { id: '1', name: 'Premium Wireless Headphones', price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', category: 'Electronics' },
    { id: '2', name: 'Designer Leather Bag', price: 189.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', category: 'Fashion' },
    { id: '3', name: 'Smart Watch Pro', price: 399.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Electronics' },
    { id: '4', name: 'Athletic Sneakers', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', category: 'Fashion' },
    { id: '5', name: 'Bluetooth Speaker', price: 89.99, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', category: 'Electronics' },
    { id: '6', name: 'Designer Sunglasses', price: 159.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', category: 'Fashion' },
    { id: '7', name: 'Modern Table Lamp', price: 79.99, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', category: 'Home & Living' },
    { id: '8', name: 'Yoga Mat Premium', price: 49.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', category: 'Sports' },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark via-dark-light to-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
          <p className="text-xl text-gray-300">Discover our complete collection</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button className="btn-outline inline-flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card overflow-hidden group">
              <Link to={`/product/${product.id}`} className="block relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </Link>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-2xl font-bold text-primary">${product.price}</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-dark text-white px-4 py-2 rounded-lg hover:bg-dark-light transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
