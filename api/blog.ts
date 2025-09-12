import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { slug } = req.query;
      
      if (slug) {
        // Get single blog by slug
        let decodedSlug = decodeURIComponent(slug as string);
        
        // Try exact match first
        let result = await sql`SELECT * FROM blogs WHERE slug = ${decodedSlug} AND status = 'published'`;
        let blog = result[0];
        
        // If not found, try with hyphens instead of spaces
        if (!blog && decodedSlug.includes(' ')) {
          const hyphenSlug = decodedSlug.replace(/\s+/g, '-').toLowerCase();
          result = await sql`SELECT * FROM blogs WHERE slug = ${hyphenSlug} AND status = 'published'`;
          blog = result[0];
        }
        
        // If still not found, try to find any blog with similar title
        if (!blog) {
          const titleSearch = decodedSlug.replace(/[-\s]+/g, ' ');
          result = await sql`SELECT * FROM blogs WHERE LOWER(title) LIKE ${`%${titleSearch.toLowerCase()}%`} AND status = 'published'`;
          blog = result[0];
        }
        
        if (!blog) {
          return res.status(404).json({ success: false, message: "Blog not found" });
        }
        
        // Convert snake_case to camelCase for frontend compatibility
        const blogWithCamelCase = {
          ...blog,
          createdAt: blog.created_at,
          updatedAt: blog.updated_at,
          featuredImage: blog.featured_image
        };
        
        return res.json({ success: true, blog: blogWithCamelCase });
      } else {
        // Get all published blogs
        const blogsResult = await sql`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC`;
        
        // Convert snake_case to camelCase for frontend compatibility
        const blogs = blogsResult.map(blog => ({
          ...blog,
          createdAt: blog.created_at,
          updatedAt: blog.updated_at,
          featuredImage: blog.featured_image
        }));
        
        return res.json({ success: true, blogs });
      }
    } catch (error) {
      console.error('Blog API error:', error);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to fetch blogs",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}