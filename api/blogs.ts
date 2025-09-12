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
      
      // Get only published blogs
      const blogs = await sql`
        SELECT * FROM blogs 
        WHERE status = 'published' 
        ORDER BY created_at DESC
      `;
      
      res.json({ success: true, blogs });
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch blogs",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}