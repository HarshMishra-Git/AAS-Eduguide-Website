import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || (blog.tags && blog.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(
    blogs.flatMap(blog => blog.tags ? blog.tags.split(',').map(tag => tag.trim()) : [])
  ));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20 relative overflow-hidden">
      {/* Creative Background Infographics */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-32 left-8 w-40 h-40 text-blue-100 opacity-20" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1"/>
          <circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.3"/>
          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="16">🎓</text>
        </svg>
        
        <svg className="absolute top-20 right-16 w-32 h-32 text-green-100 opacity-30" viewBox="0 0 100 100">
          <path d="M20 80 Q50 20 80 80" fill="none" stroke="currentColor" strokeWidth="3"/>
          <circle cx="20" cy="80" r="4" fill="currentColor"/>
          <circle cx="50" cy="50" r="4" fill="currentColor"/>
          <circle cx="80" cy="80" r="4" fill="currentColor"/>
        </svg>
        
        <svg className="absolute bottom-32 left-16 w-36 h-36 text-blue-200 opacity-25" viewBox="0 0 120 120">
          <rect x="20" y="40" width="80" height="60" rx="8" fill="currentColor"/>
          <rect x="30" y="20" width="60" height="40" rx="6" fill="currentColor" opacity="0.7"/>
          <circle cx="60" cy="40" r="8" fill="white"/>
          <text x="60" y="45" textAnchor="middle" fill="currentColor" fontSize="8">📊</text>
        </svg>
        
        <svg className="absolute bottom-40 right-20 w-28 h-28 text-green-200 opacity-35" viewBox="0 0 100 100">
          <polygon points="50,15 85,85 15,85" fill="currentColor"/>
          <circle cx="50" cy="60" r="12" fill="white" opacity="0.8"/>
          <text x="50" y="65" textAnchor="middle" fill="currentColor" fontSize="10">✓</text>
        </svg>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-brand-green rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-brand-navy rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-navy mb-6">
            AAS Eduguide Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest insights, tips, and guidance for medical admissions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag('')}
            >
              All
            </Button>
            {allTags.map(tag => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blogs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <GlassCard key={blog.id} className="p-6 hover-lift cursor-pointer group relative overflow-hidden">
                {/* Card decorative elements */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-20 ${index % 3 === 0 ? 'bg-brand-green' : index % 3 === 1 ? 'bg-brand-navy' : 'bg-blue-400'}`}></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-tr from-green-200 to-blue-200 rounded-full opacity-25"></div>
                {blog.featuredImage && (
                  <div className="mb-4 overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={convertImageUrl(blog.featuredImage)}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                        
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"%3E%3Crect width="400" height="200" fill="%23f3f4f6"/%3E%3Ctext x="200" y="100" text-anchor="middle" fill="%236b7280" font-family="Arial" font-size="14"%3EImage not available%3C/text%3E%3C/svg%3E';
                        target.className = 'w-full h-48 object-cover opacity-75';
                      }}
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="mb-3">
                  {blog.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-green transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{readingTime(blog.content)} min read</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-brand-green group-hover:text-white transition-colors"
                  onClick={() => window.location.href = `/blog/${blog.slug}`}
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}