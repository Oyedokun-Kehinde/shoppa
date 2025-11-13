import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Tag, TrendingUp, Clock, MessageSquare } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', count: 15 },
    { name: 'Fashion', count: 5 },
    { name: 'Technology', count: 3 },
    { name: 'Lifestyle', count: 4 },
    { name: 'Shopping Tips', count: 2 },
    { name: 'Product Reviews', count: 1 },
  ];

  // Static data for latest posts sidebar
  const latestPosts = [
    {
      title: 'Top 10 Fashion Trends for 2024',
      slug: 'top-10-fashion-trends-2024',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200',
      date: '2024-01-15',
    },
    {
      title: 'Ultimate Guide to Smart Shopping',
      slug: 'ultimate-guide-smart-shopping',
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=200',
      date: '2024-01-12',
    },
    {
      title: 'Best Tech Gadgets of the Season',
      slug: 'best-tech-gadgets-season',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200',
      date: '2024-01-10',
    },
  ];

  // Static recent comments
  const recentComments = [
    { author: 'Sarah M.', comment: 'Great article! Very helpful tips.', post: 'Shopping Guide' },
    { author: 'John D.', comment: 'Love the fashion insights!', post: 'Fashion Trends' },
    { author: 'Emma W.', comment: 'Thanks for the recommendations.', post: 'Tech Gadgets' },
  ];

  // Popular tags
  const popularTags = [
    'Fashion',
    'Tech',
    'Shopping',
    'Lifestyle',
    'Reviews',
    'Trends',
    'Style',
    'Gadgets',
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/blog/posts');
      console.log('Blog posts:', response.data);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post: any) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Stay updated with the latest trends, tips, and stories from the world of e-commerce
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Blog Posts */}
          <div className="lg:col-span-8">
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              />
            </div>

            {/* Blog Posts */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading blog posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No blog posts found. Please check back later!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredPosts.map((post: any) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="md:flex">
                      {/* Featured Image */}
                      <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                        <img
                          src={post.featured_image || 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=500'}
                          alt={post.title}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:w-2/3 p-6">
                        <h2 className="text-2xl font-bold text-dark mb-3 hover:text-primary transition-colors">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h2>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          </span>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <Link
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors"
                        >
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Categories Widget */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-sm ${selectedCategory === category.name ? 'text-white/80' : 'text-gray-500'}`}>
                        ({category.count})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest Posts Widget */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Latest Posts
              </h3>
              <div className="space-y-4">
                {latestPosts.map((post, index) => (
                  <Link
                    key={index}
                    to={`/blog/${post.slug}`}
                    className="flex space-x-3 group"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-dark group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tags Widget */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary" />
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary hover:text-white transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Comments Widget */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-dark mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                Recent Comments
              </h3>
              <div className="space-y-4">
                {recentComments.map((comment, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold text-dark">{comment.author}</span> on
                      <span className="text-primary"> {comment.post}</span>
                    </p>
                    <p className="text-xs text-gray-500 italic">"{comment.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Blog;
