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
      const { slug } = req.query;
      
      if (!slug) {
        return res.status(400).json({ 
          success: false, 
          message: "Slug is required" 
        });
      }

      const sql = neon(process.env.DATABASE_URL!);
      
      // Get blog by slug (only if published)
      const result = await sql`
        SELECT * FROM blogs 
        WHERE slug = ${slug} AND status = 'published'
      `;
      
      const blog = result[0];
      
      if (!blog) {
        return res.status(404).json({ 
          success: false, 
          message: "Blog not found" 
        });
      }
      
      res.json({ success: true, blog });
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch blog",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}