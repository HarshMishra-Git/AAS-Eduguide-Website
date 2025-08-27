import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { storage } from '../server/storage';
import { insertLeadSchema, insertNewsletterSchema, insertContactSchema } from '../shared/schema';
import { z } from 'zod';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.post('/leads', async (req, res) => {
  try {
    const leadData = insertLeadSchema.parse(req.body);
    const lead = await storage.createLead(leadData);
    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create lead" });
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const contactData = insertContactSchema.parse(req.body);
    const contact = await storage.createContact(contactData);
    res.json({ success: true, contact });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create contact" });
  }
});

app.post('/newsletter', async (req, res) => {
  try {
    const newsletterData = insertNewsletterSchema.parse(req.body);
    const newsletter = await storage.subscribeNewsletter(newsletterData);
    res.json({ success: true, newsletter });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to subscribe" });
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}