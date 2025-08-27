import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { insertLeadSchema, insertNewsletterSchema, insertContactSchema } from '../shared/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method, body } = req;
  const path = url?.split('/api/')[1] || '';

  try {
    if (method === 'POST' && path === 'leads') {
      const leadData = insertLeadSchema.parse(body);
      const lead = await storage.createLead(leadData);
      return res.json({ success: true, lead });
    }
    
    if (method === 'POST' && path === 'contacts') {
      const contactData = insertContactSchema.parse(body);
      const contact = await storage.createContact(contactData);
      return res.json({ success: true, contact });
    }
    
    if (method === 'POST' && path === 'newsletter') {
      const newsletterData = insertNewsletterSchema.parse(body);
      const newsletter = await storage.subscribeNewsletter(newsletterData);
      return res.json({ success: true, newsletter });
    }
    
    if (method === 'GET' && path === 'health') {
      return res.json({ success: true, message: 'OK' });
    }
    
    return res.status(404).json({ success: false, message: 'Not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}