import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle blog requests
  if (req.url?.includes('/api/contacts/blogs')) {
    const sql = neon(process.env.DATABASE_URL!);
    
    if (req.method === 'GET') {
      try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathParts = url.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && lastPart !== 'blogs') {
          // Decode the slug properly
          let decodedSlug = decodeURIComponent(lastPart);
          
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
            console.log('Blog not found for slug:', decodedSlug);
            return res.status(404).json({ success: false, message: "Blog not found", searchedSlug: decodedSlug });
          }
          
          return res.json({ success: true, blog });
        } else {
          // Get all published blogs
          const blogs = await sql`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC`;
          return res.json({ success: true, blogs });
        }
      } catch (error) {
        console.error('Blog API error:', error);
        return res.status(500).json({ success: false, message: "Failed to fetch blogs", error: (error as Error).message });
      }
    }
  }

  if (req.method === 'POST') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { fullName, email, phone, exam, preferredState, message } = req.body;
      
      // Simple validation
      if (!fullName || !email || !phone || !exam) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields" 
        });
      }

      // Insert into database
      const result = await sql`
        INSERT INTO contacts (full_name, email, phone, exam, preferred_state, message)
        VALUES (${fullName}, ${email}, ${phone}, ${exam}, ${preferredState || ''}, ${message || ''})
        RETURNING *
      `;
      
      console.log('Contact saved:', result[0]);
      
      res.json({ success: true, contact: result[0] });
    } catch (error) {
      console.error('Contact error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create contact",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}