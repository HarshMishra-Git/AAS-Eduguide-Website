import type { VercelRequest, VercelResponse } from '@vercel/node';
import { insertBamsAdmissionSchema } from '@shared/schema';
import { z } from 'zod';
import { storage } from '../server/storage';

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '');
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('BAMS API called:', req.method, req.url, 'Production Debug v2');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('BAMS API OPTIONS request');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      console.log('BAMS admission request received:', JSON.stringify(req.body, null, 2));
      
      // Validate request body
      const validatedData = insertBamsAdmissionSchema.parse(req.body);
      
      console.log('BAMS admission data validated:', validatedData);
      
      // Additional validation
      if (!validateEmail(validatedData.email)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid email address' 
        });
      }
      
      if (!validatePhone(validatedData.phone)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please provide a valid phone number' 
        });
      }
      
      // Use storage layer (same as development server)
      const bamsAdmission = await storage.createBamsAdmission(validatedData);
      
      console.log('BAMS admission created successfully:', bamsAdmission);
      
      res.status(201).json({
        success: true,
        message: 'BAMS admission inquiry submitted successfully! Our experts will contact you within 15 minutes.',
        id: bamsAdmission.id
      });
      
    } catch (error) {
      console.error('BAMS admission submission error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        requestBody: req.body
      });
      
      if (error instanceof z.ZodError) {
        console.error('Zod validation errors:', error.errors);
        return res.status(400).json({
          success: false,
          message: 'Please check your input and try again',
          errors: error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to submit BAMS admission inquiry. Please try again or contact support.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'GET') {
    try {
      // Get recent BAMS admissions (for admin purposes)
      const admissions = await storage.getBamsAdmissions();
      
      res.status(200).json({
        success: true,
        data: admissions.slice(0, 50), // Limit to 50 for consistency
        count: admissions.length
      });
      
    } catch (error) {
      console.error('BAMS admissions fetch error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch BAMS admissions data'
      });
    }
  } else {
    res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }
}