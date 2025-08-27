import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
    database: 'disconnected',
  };

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const contacts = await sql`SELECT COUNT(*) as count FROM contacts`;
    healthCheck.database = 'connected';
    
    res.json({ 
      success: true,
      ...healthCheck,
      stats: {
        contactCount: contacts[0].count
      }
    });
  } catch (error) {
    res.status(503).json({ 
      success: false,
      ...healthCheck,
      error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : (error as Error).message
    });
  }
}