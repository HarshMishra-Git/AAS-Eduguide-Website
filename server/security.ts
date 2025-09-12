import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[\r\n]/g, ' ') // Replace newlines for log safety
    .trim()
    .slice(0, 1000); // Limit length
};

export const sanitizeForLog = (input: any): string => {
  if (typeof input === 'object') {
    input = JSON.stringify(input);
  }
  return String(input)
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[<>]/g, '')
    .slice(0, 500);
};

export const sanitizeHtml = (html: string): string => {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// CSRF Protection
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || !sessionToken || token !== sessionToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};

// Path validation
export const validatePath = (path: string): boolean => {
  if (!path || typeof path !== 'string') return false;
  
  // Check for path traversal attempts
  if (path.includes('..') || path.includes('~') || path.startsWith('/')) {
    return false;
  }
  
  // Only allow alphanumeric, dots, hyphens, underscores
  return /^[a-zA-Z0-9._-]+$/.test(path);
};

// Safe redirect validation
export const validateRedirectUrl = (url: string, allowedDomains: string[] = []): boolean => {
  if (!url) return false;
  
  try {
    const parsed = new URL(url);
    
    // Only allow relative URLs or whitelisted domains
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return false;
    }
    
    if (parsed.hostname && !allowedDomains.includes(parsed.hostname)) {
      return false;
    }
    
    return true;
  } catch {
    // If it's a relative URL, allow it
    return url.startsWith('/') && !url.startsWith('//');
  }
};