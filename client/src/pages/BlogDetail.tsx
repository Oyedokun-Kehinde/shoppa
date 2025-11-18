import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ChevronRight, ThumbsUp, Heart, Lightbulb, Smile } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string;
  created_at: string;
  likes_count: number;
  loves_count: number;
  insightful_count: number;
  celebrate_count: number;
  comments_count: number;
}

interface Comment {
  id: number;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: string;
}

interface Reaction {
  type: 'like' | 'love' | 'insightful' | 'celebrate';
  icon: any;
  label: string;
  color: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [userReactions, setUserReactions] = useState<string[]>([]);

  const reactions: Reaction[] = [
    { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-600' },
    { type: 'love', icon: Heart, label: 'Love', color: 'text-red-600' },
    { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-yellow-600' },
    { type: 'celebrate', icon: Smile, label: 'Celebrate', color: 'text-green-600' },
  ];

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/blog/posts/${slug}`);
      setPost(data);

      // Fetch comments
      const commentsRes = await axios.get(`http://localhost:5000/api/blog/${data.id}/comments`);
      setComments(commentsRes.data);

      // Fetch related posts
      if (data.category) {
        const relatedRes = await axios.get(`http://localhost:5000/api/blog/posts?category=${data.category}`);
        setRelatedPosts(relatedRes.data.filter((p: BlogPost) => p.id !== data.id).slice(0, 3));
      }

      // Check user's reactions
      if (user) {
        try {
          const reactionRes = await axios.get(
            `http://localhost:5000/api/blog/${data.id}/reaction`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
          );
          setUserReactions(reactionRes.data.reactions || []);
        } catch (err) {
          // No reactions yet
          setUserReactions([]);
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast.error('Blog post not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login again to comment');
        return;
      }

      console.log('Submitting comment for post:', post?.id);
      
      await axios.post(
        `http://localhost:5000/api/blog/${post?.id}/comments`,
        { comment: commentText.trim() },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.success('Comment posted successfully!');
      setCommentText('');
      
      // Refresh comments
      const commentsRes = await axios.get(`http://localhost:5000/api/blog/${post?.id}/comments`);
      setComments(commentsRes.data);
      
      // Refresh post to update comment count
      await fetchBlogPost();
    } catch (error: any) {
      console.error('Comment submission error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Unable to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReaction = async (type: string) => {
    if (!post) return;

    // Always generate/retrieve session ID
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }

    try {
      // Always send session_id, but also auth header if user is logged in
      const payload = { 
        reaction_type: type, 
        session_id: sessionId 
      };

      const headers = user 
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {};

      const response = await axios.post(
        `http://localhost:5000/api/blog/${post.id}/reaction`,
        payload,
        { headers }
      );

      // Toggle reaction in array
      setUserReactions(prev => {
        if (prev.includes(type)) {
          return prev.filter(r => r !== type); // Remove
        } else {
          return [...prev, type]; // Add
        }
      });
      
      // Update post counts immediately from response
      if (response.data.counts && post) {
        setPost({
          ...post,
          likes_count: response.data.counts.likes_count,
          loves_count: response.data.counts.loves_count,
          insightful_count: response.data.counts.insightful_count,
          celebrate_count: response.data.counts.celebrate_count
        });
      }
      
      const action = userReactions.includes(type) ? 'removed' : 'added';
      toast.success(`Reaction ${action}!`);
    } catch (error: any) {
      console.error('Reaction error:', error);
      toast.error(error.response?.data?.message || 'Failed to add reaction');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">Blog post not found</h2>
          <Link to="/blog" className="btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/blog" className="hover:text-primary">Blog</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-dark font-medium">{post.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
              <img 
                src={post.featured_image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="mb-6">
                <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">{post.title}</h1>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center space-x-6 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{new Date(post.created_at).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>{post.comments_count} Comments</span>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
                  {post.excerpt}
                </p>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Reactions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold text-dark mb-6">How do you feel about this post?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reactions.map((reaction) => {
                  const Icon = reaction.icon;
                  const count = post[`${reaction.type}s_count` as keyof BlogPost] as number || 0;
                  const isActive = userReactions.includes(reaction.type);
                  
                  return (
                    <button
                      key={reaction.type}
                      onClick={() => handleReaction(reaction.type)}
                      className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                        isActive 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      <Icon className={`h-8 w-8 mx-auto mb-3 ${isActive ? 'text-primary' : reaction.color}`} />
                      <p className="font-semibold text-dark text-base mb-2">{reaction.label}</p>
                      <p className="text-2xl font-bold text-primary">{count}</p>
                    </button>
                  );
                })}
              </div>
              {!user && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Your reaction is anonymous and helps us improve content
                </p>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-dark mb-6">
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    disabled={submittingComment}
                  ></textarea>
                  <div className="flex justify-end mt-4">
                    <button 
                      type="submit" 
                      className="btn-primary"
                      disabled={submittingComment}
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">Please login to leave a comment</p>
                  <Link to="/login" className="btn-primary inline-block">
                    Login to Comment
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-lg">
                          {comment.user_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-dark">{comment.user_name}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{comment.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Author Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-dark mb-4">About the Author</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-2xl">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark">{post.author}</h4>
                    <p className="text-sm text-gray-500">Content Writer</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Passionate about sharing insights on shopping, lifestyle, and trends.
                </p>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-bold text-dark mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.id}
                        to={`/blog/${related.slug}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <img
                            src={related.featured_image}
                            alt={related.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-dark text-sm group-hover:text-primary transition-colors line-clamp-2 mb-1">
                              {related.title}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {new Date(related.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="bg-gradient-to-br from-primary to-red-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold text-xl mb-2">Stay Updated</h3>
                <p className="text-sm mb-4 opacity-90">
                  Get the latest blog posts delivered to your inbox
                </p>
                <Link to="/" className="block w-full bg-white text-primary text-center py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
