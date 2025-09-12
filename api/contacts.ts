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
  if (req.url?.startsWith('/api/contacts/blogs')) {
    const sql = neon(process.env.DATABASE_URL!);
    
    if (req.method === 'GET') {
      try {
        const pathParts = req.url.split('/');
        const slug = pathParts[pathParts.length - 1];
        
        if (slug && slug !== 'blogs') {
          // Get single blog by slug
          const result = await sql`SELECT * FROM blogs WHERE slug = ${slug} AND status = 'published'`;
          const blog = result[0];
          
          if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
          }
          
          return res.json({ success: true, blog });
        } else {
          // Get all published blogs
          const blogs = await sql`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC`;
          return res.json({ success: true, blogs });
        }
      } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch blogs" });
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