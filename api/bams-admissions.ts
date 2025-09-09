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

  if (req.method === 'POST') {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const { fullName, email, phone, category, domicileState, counselingType, message } = req.body;
      
      // Simple validation
      if (!fullName || !email || !phone) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields" 
        });
      }

      // Insert into database using exact column names from migration
      const result = await sql`
        INSERT INTO bams_admissions (full_name, email, phone, category, domicile_state, counseling_type, message)
        VALUES (${fullName}, ${email}, ${phone}, ${category || 'general'}, ${domicileState || 'uttar-pradesh'}, ${counselingType || 'state'}, ${message || ''})
        RETURNING *
      `;
      
      console.log('BAMS admission saved:', result[0]);
      
      res.json({ 
        success: true, 
        message: 'BAMS admission inquiry submitted successfully! Our experts will contact you within 15 minutes.',
        bamsAdmission: result[0] 
      });
    } catch (error) {
      console.error('BAMS admission error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to submit BAMS admission inquiry",
        error: (error as Error).message 
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}