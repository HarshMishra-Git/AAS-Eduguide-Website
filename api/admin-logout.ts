import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.setHeader('Set-Cookie', 'admin=; HttpOnly; Path=/; Max-Age=0');
    res.redirect(302, '/api/admin-login');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}