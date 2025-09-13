import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Test endpoint
  if (req.method === 'GET') {
    return res.json({ message: 'Leads API is working', timestamp: new Date().toISOString() });
  }

  if (req.method === 'POST') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { name, email, phone, exam, preferredState, message, source } = req.body;
      
      if (!name || !email || !phone || !exam) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields",
          received: { name, email, phone, exam }
        });
      }

      const result = await sql`
        INSERT INTO leads (name, email, phone, exam, preferred_state, message, source)
        VALUES (${name}, ${email}, ${phone}, ${exam}, ${preferredState || ''}, ${message || ''}, ${source || 'chatbot'})
        RETURNING *
      `;
      
      console.log('Lead saved successfully:', result[0]);
      if (source === 'bams_sanskaram_university') {
        res.json({ success: true, admission: result[0] });
      } else {
        res.json({ success: true, lead: result[0] });
      }
    } catch (error) {
      console.error('Lead creation error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create lead",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}