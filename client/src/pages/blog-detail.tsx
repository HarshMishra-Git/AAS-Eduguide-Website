import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StructuredContent } from '@/components/ui/structured-content';
import { ContactPopup } from '@/components/ui/contact-popup';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog(slug);
    }
  }, [slug]);

  const fetchBlog = async (blogSlug: string) => {
    try {
      const response = await fetch(`/api/contacts/blogs/${blogSlug}`);
      const data = await response.json();
      if (data.success) {
        setBlog(data.blog);
      } else {
        setError('Blog not found');
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const convertImageUrl = (url: string) => {
    if (!url) return url;
    
    // Handle Google Drive URLs (though they may not work due to CORS)
    if (url.includes('drive.google.com/file/d/')) {
      const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch) {
        return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
      }
    }
    
    // Handle other image URLs as-is
    return url;
  };

  const sharePost = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
          <Button onClick={() => window.location.href = '/blogs'}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-20 left-10 w-32 h-32 text-blue-100 opacity-30" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="currentColor"/>
          <path d="M30 50h40M50 30v40" stroke="white" strokeWidth="2"/>
        </svg>
        <svg className="absolute top-40 right-20 w-24 h-24 text-green-100 opacity-40" viewBox="0 0 100 100">
          <polygon points="50,10 90,90 10,90" fill="currentColor"/>
        </svg>
        <svg className="absolute bottom-40 left-20 w-28 h-28 text-blue-200 opacity-25" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" rx="10" fill="currentColor"/>
          <circle cx="35" cy="35" r="5" fill="white"/>
          <circle cx="65" cy="65" r="5" fill="white"/>
        </svg>
        <svg className="absolute bottom-20 right-10 w-36 h-36 text-green-200 opacity-20" viewBox="0 0 100 100">
          <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="currentColor"/>
          <text x="50" y="55" textAnchor="middle" fill="white" fontSize="12">📚</text>
        </svg>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Back Button */}
        <Button
          variant="outline"
          className="mb-6"
          onClick={() => window.location.href = '/blogs'}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Button>

        <GlassCard className="p-8 relative">
          {/* Article decorative elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-brand-green to-brand-navy rounded-full opacity-10"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-tr from-blue-300 to-green-300 rounded-full opacity-15"></div>
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="mb-8 overflow-hidden rounded-lg bg-gray-200">
              <img
                src={convertImageUrl(blog.featuredImage)}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const currentSrc = target.src;
                  
                  if (currentSrc.includes('lh3.googleusercontent.com')) {
                    const fileId = currentSrc.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
                    if (fileId) {
                      target.src = `https://drive.google.com/uc?export=view&id=${fileId}`;
                      return;
                    }
                  } else if (currentSrc.includes('drive.google.com/uc')) {
                    const fileId = currentSrc.match(/id=([a-zA-Z0-9-_]+)/)?.[1];
                    if (fileId) {
                      target.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
                      return;
                    }
                  }
                  
                  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="16"%3EImage not available%3C/text%3E%3C/svg%3E';
                  target.className = 'w-full h-64 md:h-96 object-cover opacity-75';
                }}
                loading="lazy"
              />
            </div>
          )}

          {/* Tags */}
          {blog.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.split(',').map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Published: {formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{readingTime(blog.content)} min read</span>
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <span>Updated: {formatDate(blog.updatedAt)}</span>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={sharePost}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Excerpt */}
          <div className="text-lg text-gray-600 mb-8 p-4 bg-gray-50 rounded-lg border-l-4 border-brand-green">
            {blog.excerpt}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <StructuredContent content={blog.content} />
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {blog.updatedAt !== blog.createdAt ? (
                  <span>Last updated: {formatDate(blog.updatedAt)}</span>
                ) : (
                  <span>Published: {formatDate(blog.createdAt)}</span>
                )}
              </div>
              
              <Button
                onClick={sharePost}
                className="btn-primary text-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share this post
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Call to Action */}
        <GlassCard className="p-6 mt-8 text-center">
          <h3 className="text-xl font-bold text-brand-navy mb-4">
            Need Expert Guidance for Medical Admissions?
          </h3>
          <p className="text-gray-600 mb-6">
            Get personalized counseling and support for NEET UG/PG, DNB, and INI-CET admissions.
          </p>
          <Button
            className="btn-primary text-white"
            onClick={() => setShowContactPopup(true)}
          >
            Get Free Consultation
          </Button>
        </GlassCard>
        
        <ContactPopup 
          isOpen={showContactPopup} 
          onClose={() => setShowContactPopup(false)} 
        />
      </div>
    </div>
  );
}