import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, Truck, Shield, 
  RotateCcw, Share2, Plus, Minus, ChevronRight 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  num_reviews: number;
  specifications: string;
  features: string;
}

interface Review {
  id: number;
  user_id: number;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
}

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when product changes
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/products/slug/${slug}`);
      setProduct(data);

      // Fetch related products
      if (data.category) {
        const relatedRes = await axios.get(`http://localhost:5000/api/products?category=${data.category}&limit=4`);
        setRelatedProducts(relatedRes.data.filter((p: Product) => p.id !== data.id).slice(0, 4));
      }

      // Fetch reviews
      const reviewsRes = await axios.get(`http://localhost:5000/api/products/${data.id}/reviews`);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (product) {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image
        });
      }
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const toggleWishlist = () => {
    if (!user) {
      toast.error('Please login to add items to wishlist');
      navigate('/login');
      return;
    }

    if (product) {
      const isInWishlist = wishlistItems.some(item => item.id === product.id);
      if (isInWishlist) {
        removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
        });
        toast.success('Added to wishlist!');
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${product?.id}/reviews`,
        reviewForm,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      fetchProductDetails();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on Shoppa!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const isInWishlist = product ? wishlistItems.some(item => item.id === product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const specifications = product.specifications ? product.specifications.split('|').map(s => s.trim()) : [];
  const features = product.features ? product.features.split('|').map(f => f.trim()) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/shop" className="hover:text-primary">Shop</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/shop?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-dark font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-primary font-semibold mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-dark mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-dark">{product.rating}</span>
                <span className="text-gray-500">({product.num_reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-5xl font-bold text-primary">₦{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout</p>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 font-semibold">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-800 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-dark mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-6 w-6 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center transition-all ${
                    isInWishlist 
                      ? 'bg-red-500 border-red-500 text-white' 
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-16 h-16 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-primary transition-colors"
                  title="Share this product"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t">
                <div className="text-center">
                  <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-dark">Free Delivery</p>
                  <p className="text-xs text-gray-500">In Akure</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-dark">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% Protected</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-dark">Easy Returns</p>
                  <p className="text-xs text-gray-500">30 Days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <div className="border-b mb-8">
            <div className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 font-semibold capitalize transition-colors relative ${
                    activeTab === tab 
                      ? 'text-primary' 
                      : 'text-gray-500 hover:text-dark'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'description' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-dark mb-4">Product Description</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{product.long_description}</p>
              </div>
              {features.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-4">Key Features</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="text-2xl font-bold text-dark mb-6">Technical Specifications</h3>
              <div className="space-y-3">
                {specifications.map((spec, index) => {
                  const [key, value] = spec.split(':').map(s => s.trim());
                  return (
                    <div key={index} className="flex border-b pb-3">
                      <span className="font-semibold text-dark w-1/3">{key}</span>
                      <span className="text-gray-600 w-2/3">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-dark mb-2">{product.rating}</div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{product.num_reviews} reviews</p>
                  </div>
                </div>
              </div>

              {/* Write Review */}
              <div className="border-t pt-8">
                <h3 className="text-2xl font-bold text-dark mb-6">Write a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`h-8 w-8 ${star <= reviewForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Review Title</label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-dark mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={4}
                      placeholder="Share your thoughts about this product"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-primary">
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6 border-t pt-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-dark">{review.user_name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.title && <h4 className="font-semibold text-dark mb-2">{review.title}</h4>}
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-dark mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/product/${related.slug}`}
                  className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={related.image}
                      alt={related.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-1">{related.category}</p>
                    <h3 className="font-semibold text-dark mb-2 group-hover:text-primary transition-colors">
                      {related.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-primary">₦{related.price.toLocaleString()}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{related.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
