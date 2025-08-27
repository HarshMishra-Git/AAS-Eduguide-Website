import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: "Email is required" 
        });
      }

      const result = await sql`
        INSERT INTO newsletters (email)
        VALUES (${email})
        RETURNING *
      `;
      
      res.json({ success: true, newsletter: result[0] });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to subscribe",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}