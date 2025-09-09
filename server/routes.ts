import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertNewsletterSchema, insertContactSchema, insertBamsAdmissionSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import compression from "compression";
import { body, validationResult } from "express-validator";
import { logger } from "./logger";

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
  }
}

// Simple CSRF token generation
function generateCSRFToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// HTML sanitization helper
function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}



// Secure admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$12$FrhHWFzmcYacalhnT2gUyeCyLuAS8xJzs55ajyudyVrRVak6XLBhu";

// Security middleware
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://www.google.com"],
        connectSrc: ["'self'", "https:"],
      },
    } : false,
    hsts: process.env.NODE_ENV === 'production' ? {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    } : false,
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'same-origin' }
  }),
  compression(),
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN 
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
];

// HTTPS redirect middleware for production only
const httpsRedirect = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
};

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const validateLead = [
  body('name').trim().isLength({ min: 1, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 1, max: 20 }),
  body('exam').trim().isLength({ min: 1, max: 50 }).escape(),
  body('preferredState').optional().trim().isLength({ max: 50 }).escape(),
  body('message').optional().trim().isLength({ max: 500 }).escape(),
];

const validateContact = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('any'),
  body('exam').isIn(['neet-ug', 'neet-pg', 'dnb', 'ini-cet']),
  body('preferredState').optional().trim().isLength({ max: 50 }).escape(),
  body('message').optional().trim().isLength({ max: 500 }).escape(),
];

const validateNewsletter = [
  body('email').isEmail().normalizeEmail(),
];

const validateBamsAdmission = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isMobilePhone('any'),
  body('category').optional().isIn(['general', 'obc', 'sc', 'st']),
  body('domicileState').optional().trim().isLength({ max: 50 }).escape(),
  body('counselingType').optional().isIn(['state', 'aiq', 'deemed', 'private']),
  body('message').optional().trim().isLength({ max: 500 }).escape(),
];

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};



export async function registerRoutes(app: Express): Promise<Server> {
  // HTTPS redirect in production only
  if (process.env.NODE_ENV === 'production') {
    app.use(httpsRedirect);
  }
  
  // Apply security middleware
  app.use(securityMiddleware);
  
  // Apply rate limiting only in production
  if (process.env.NODE_ENV === 'production') {
    app.use('/api', rateLimiter);
  }
  
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    }
  }));

  // CSRF token endpoint
  app.get("/api/csrf-token", (req, res) => {
    const token = generateCSRFToken();
    res.json({ csrfToken: token });
  });

  // Lead submission endpoint
  app.post("/api/leads", validateLead, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      console.log('New lead submission saved:', leadData.name, leadData.email);
      
      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid data provided",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to create lead" 
        });
      }
    }
  });

  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch leads" 
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", validateNewsletter, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.subscribeNewsletter(newsletterData);
      
      console.log('New newsletter subscription saved:', newsletterData.email);
      
      res.json({ success: true, newsletter });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid email provided",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to subscribe to newsletter" 
        });
      }
    }
  });

  // Contact form submission endpoint
  app.post("/api/contacts", validateContact, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      console.log('Contact form submission received:', req.body);
      
      const contactData = insertContactSchema.parse(req.body);
      console.log('Contact data validated:', contactData);
      
      const contact = await storage.createContact(contactData);
      console.log('Contact saved successfully:', contact);
      
      console.log('New contact submission saved:', contactData.fullName, contactData.email);
      
      res.json({ success: true, contact });
    } catch (error) {
      console.error('Contact form error:', error);
      
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Invalid contact data provided",
          errors: error.errors 
        });
      } else {
        console.error('Database or other error:', (error as Error).message, (error as Error).stack);
        res.status(500).json({ 
          success: false, 
          message: "Failed to create contact",
          error: (error as Error).message 
        });
      }
    }
  });

  // Get all contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contacts",
        error: (error as Error).message 
      });
    }
  });

  // BAMS admission submission endpoint
  app.post("/api/bams-admissions", validateBamsAdmission, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      console.log('BAMS admission request received:', req.body);
      
      const bamsData = insertBamsAdmissionSchema.parse(req.body);
      console.log('BAMS admission data validated:', bamsData);
      
      const bamsAdmission = await storage.createBamsAdmission(bamsData);
      console.log('BAMS admission saved successfully:', bamsAdmission);
      
      console.log('New BAMS admission saved:', bamsData.fullName, bamsData.email);
      
      res.json({ 
        success: true, 
        message: 'BAMS admission inquiry submitted successfully! Our experts will contact you within 15 minutes.',
        id: bamsAdmission.id 
      });
    } catch (error) {
      console.error('BAMS admission submission error:', error);
      
      if (error instanceof z.ZodError) {
        console.error('BAMS validation errors:', error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Invalid BAMS admission data provided",
          errors: error.errors 
        });
      } else {
        console.error('BAMS database or other error:', (error as Error).message, (error as Error).stack);
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit BAMS admission inquiry",
          error: (error as Error).message 
        });
      }
    }
  });

  // Get all BAMS admissions
  app.get("/api/bams-admissions", async (req, res) => {
    try {
      const bamsAdmissions = await storage.getBamsAdmissions();
      res.json({ success: true, data: bamsAdmissions, count: bamsAdmissions.length });
    } catch (error) {
      console.error('Failed to fetch BAMS admissions:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch BAMS admissions",
        error: (error as Error).message 
      });
    }
  });

  // Enhanced health check endpoint
  app.get("/api/health", async (req, res) => {
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: 'disconnected',
      memory: process.memoryUsage(),
    };

    try {
      const contacts = await storage.getContacts();
      healthCheck.database = 'connected';
      res.json({ 
        success: true,
        ...healthCheck,
        stats: {
          contactCount: contacts.length
        }
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({ 
        success: false,
        ...healthCheck,
        error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : (error as Error).message
      });
    }
  });

  // Get newsletter subscriptions
  app.get("/api/newsletters", async (req, res) => {
    try {
      const newsletters = await storage.getNewsletterSubscriptions();
      res.json(newsletters);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch newsletter subscriptions" 
      });
    }
  });

  // Admin Login Page
  app.get("/admin/login", (req, res) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Login - AAS Eduguide</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1a365d 0%, #7cb342 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .login-container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 100%; max-width: 400px; }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo h1 { color: #1a365d; margin-bottom: 5px; }
        .logo p { color: #7cb342; font-weight: 500; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 5px; color: #333; font-weight: 500; }
        .form-group input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 6px; font-size: 16px; }
        .form-group input:focus { outline: none; border-color: #7cb342; }
        .btn { width: 100%; padding: 12px; background: #7cb342; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 500; cursor: pointer; }
        .btn:hover { background: #6ba037; }
        .error { color: #e53e3e; text-align: center; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="logo">
            <h1>AAS Eduguide</h1>
            <p>Admin Panel</p>
        </div>
        <form method="POST" action="/admin/login">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn">Login</button>
            ${req.query.error ? '<div class="error">Invalid username or password</div>' : ''}
        </form>
    </div>
</body>
</html>`;
    res.send(html);
  });

  // Admin Login Handler
  app.post("/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_USERNAME && await bcrypt.compare(password, ADMIN_PASSWORD_HASH)) {
      req.session.isAdmin = true;
      res.redirect('/admin');
    } else {
      res.redirect('/admin/login?error=1');
    }
  });

  // Admin Logout
  app.get("/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect('/admin/login');
    });
  });

  // Handle DELETE requests for admin dashboard
  app.delete("/admin/delete", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    try {
      const { table, id } = req.query;
      
      if (!table || !id) {
        return res.status(400).json({ success: false, message: 'Table and ID required' });
      }

      switch (table) {
        case 'leads':
          // Delete from leads table using storage
          await storage.deleteRecord('leads', id as string);
          break;
        case 'contacts':
          await storage.deleteRecord('contacts', id as string);
          break;
        case 'bams_admissions':
          await storage.deleteRecord('bams_admissions', id as string);
          break;
        case 'newsletters':
          await storage.deleteRecord('newsletters', id as string);
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid table' });
      }

      return res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete record' });
    }
  });

  // Handle Excel export for admin dashboard
  app.post("/admin/export", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    try {
      const { table } = req.query;
      
      let data: any[] = [];
      let filename = '';
      
      switch (table) {
        case 'leads':
          data = await storage.getLeads();
          filename = 'leads_export.csv';
          break;
        case 'contacts':
          data = await storage.getContacts();
          filename = 'contacts_export.csv';
          break;
        case 'bams_admissions':
          data = await storage.getBamsAdmissions();
          filename = 'bams_admissions_export.csv';
          break;
        case 'newsletters':
          data = await storage.getNewsletterSubscriptions();
          filename = 'newsletters_export.csv';
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid table' });
      }

      if (data.length === 0) {
        return res.status(404).json({ success: false, message: 'No data found' });
      }

      // Convert to CSV
      const headers = Object.keys(data[0]).join(',');
      const csvData = data.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
        ).join(',')
      ).join('\n');
      const csv = headers + '\n' + csvData;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csv);
    } catch (error) {
      console.error('Export error:', error);
      return res.status(500).json({ success: false, message: 'Failed to export data' });
    }
  });

  // Admin Dashboard (Protected)
  app.get("/admin", async (req, res) => {
    // Check if user is authenticated
    if (!req.session.isAdmin) {
      return res.redirect('/admin/login');
    }
    try {
      const [leads, contacts, newsletters, bamsAdmissions] = await Promise.all([
        storage.getLeads(),
        storage.getContacts(),
        storage.getNewsletterSubscriptions(),
        storage.getBamsAdmissions()
      ]);

      // Detect duplicates for highlighting
      const detectDuplicates = (data: any[], emailField: string, phoneField: string) => {
        const emailCounts = {};
        const phoneCounts = {};
        
        data.forEach(item => {
          const email = item[emailField];
          const phone = item[phoneField];
          if (email) emailCounts[email] = (emailCounts[email] || 0) + 1;
          if (phone) phoneCounts[phone] = (phoneCounts[phone] || 0) + 1;
        });
        
        return data.map(item => ({
          ...item,
          isDuplicate: (emailCounts[item[emailField]] > 1) || (phoneCounts[item[phoneField]] > 1)
        }));
      };

      const enhancedLeads = detectDuplicates(leads, 'email', 'phone');
      const enhancedContacts = detectDuplicates(contacts, 'email', 'phone');
      const enhancedBamsAdmissions = detectDuplicates(bamsAdmissions, 'email', 'phone');
      const enhancedNewsletters = detectDuplicates(newsletters, 'email', 'email');

      const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - AAS Eduguide</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 20px; margin-bottom: 30px; border-radius: 8px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #7cb342; }
        .stat-label { color: #666; margin-top: 5px; }
        .section { background: white; margin-bottom: 30px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .section-header { background: #7cb342; color: white; padding: 15px 20px; font-weight: bold; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
        .table th { background: #f8f9fa; font-weight: 600; }
        .table tr:hover { background: #f8f9fa; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
        .badge-success { background: #d4edda; color: #155724; }
        .no-data { padding: 40px; text-align: center; color: #666; }
        .duplicate-row { background-color: #fff3cd !important; border-left: 4px solid #ffc107; }
        .duplicate-row:hover { background-color: #ffeaa7 !important; }
        .action-buttons { display: flex; gap: 5px; align-items: center; }
        .btn { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem; text-decoration: none; display: inline-block; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
        .btn-success { background: #28a745; color: white; }
        .btn-success:hover { background: #218838; }
        .export-section { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .export-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
        .section-header-with-export { display: flex; justify-content: space-between; align-items: center; }
        @media (max-width: 768px) {
            .container { padding: 10px; }
            .table { font-size: 0.9rem; }
            .table th, .table td { padding: 8px 4px; }
            .export-buttons { flex-direction: column; }
            .action-buttons { flex-direction: column; gap: 2px; }
        }
      </style>
      <script>
        async function deleteRecord(table, id, rowElement) {
          if (!confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
            return;
          }
          
          try {
            const response = await fetch('/admin/delete?table=' + table + '&id=' + id, {
              method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
              rowElement.remove();
              alert('Record deleted successfully!');
              // Update stats
              location.reload();
            } else {
              alert('Failed to delete record: ' + result.message);
            }
          } catch (error) {
            alert('Error deleting record: ' + error.message);
          }
        }
        
        async function exportData(table) {
          try {
            const response = await fetch('/admin/export?table=' + table, {
              method: 'POST'
            });
            
            if (response.ok) {
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = table + '_export_' + new Date().toISOString().split('T')[0] + '.csv';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
              alert('Export completed successfully!');
            } else {
              const result = await response.json();
              alert('Export failed: ' + result.message);
            }
          } catch (error) {
            alert('Error exporting data: ' + error.message);
          }
        }
      </script>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>AAS Eduguide - All Admission Services</p>
                </div>
                <a href="/admin/logout" style="color: white; text-decoration: none; padding: 8px 16px; background: rgba(255,255,255,0.2); border-radius: 4px;">Logout</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${leads.length}</div>
                <div class="stat-label">Total Leads</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${contacts.length}</div>
                <div class="stat-label">Contact Forms</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${bamsAdmissions.length}</div>
                <div class="stat-label">BAMS Admissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${newsletters.length}</div>
                <div class="stat-label">Newsletter Subscribers</div>
            </div>
        </div>
        
        <div class="export-section">
            <h3 style="margin-bottom: 15px; color: #1a365d;">📊 Export Data</h3>
            <div class="export-buttons">
                <button class="btn btn-success" onclick="exportData('leads')">📥 Export Leads</button>
                <button class="btn btn-success" onclick="exportData('contacts')">📥 Export Contacts</button>
                <button class="btn btn-success" onclick="exportData('bams_admissions')">📥 Export BAMS</button>
                <button class="btn btn-success" onclick="exportData('newsletters')">📥 Export Newsletters</button>
            </div>
        </div>
        
        <div class="section">
            <div class="section-header-with-export">
                <span>Recent Leads</span>
                <button class="btn btn-success" onclick="exportData('leads')">📥 Export</button>
            </div>
            ${enhancedLeads.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Exam</th>
                        <th>State</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${enhancedLeads.slice(0, 50).map(lead => `
                    <tr id="lead-${lead.id}" ${lead.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(lead.name)} ${lead.isDuplicate ? '⚠️' : ''}</td>
                        <td>${sanitizeHtml(lead.email)}</td>
                        <td>${sanitizeHtml(lead.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(lead.exam)}</span></td>
                        <td>${lead.preferredState ? sanitizeHtml(lead.preferredState) : '-'}</td>
                        <td>${lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('leads', '${lead.id}', document.getElementById('lead-${lead.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No leads found</div>'}
        </div>

        <div class="section">
            <div class="section-header-with-export">
                <span>Contact Form Submissions</span>
                <button class="btn btn-success" onclick="exportData('contacts')">📥 Export</button>
            </div>
            ${enhancedContacts.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Exam</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${enhancedContacts.slice(0, 50).map(contact => `
                    <tr id="contact-${contact.id}" ${contact.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(contact.fullName)} ${contact.isDuplicate ? '⚠️' : ''}</td>
                        <td>${sanitizeHtml(contact.email)}</td>
                        <td>${sanitizeHtml(contact.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(contact.exam)}</span></td>
                        <td>${contact.message ? sanitizeHtml(contact.message).substring(0, 50) + '...' : '-'}</td>
                        <td>${contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('contacts', '${contact.id}', document.getElementById('contact-${contact.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No contact submissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header-with-export">
                <span>BAMS Admissions</span>
                <button class="btn btn-success" onclick="exportData('bams_admissions')">📥 Export</button>
            </div>
            ${enhancedBamsAdmissions.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Category</th>
                        <th>Counseling Type</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${enhancedBamsAdmissions.slice(0, 50).map(admission => `
                    <tr id="bams-${admission.id}" ${admission.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(admission.fullName)} ${admission.isDuplicate ? '⚠️' : ''}</td>
                        <td>${sanitizeHtml(admission.email)}</td>
                        <td>${sanitizeHtml(admission.phone)}</td>
                        <td><span class="badge badge-success">${sanitizeHtml(admission.category)}</span></td>
                        <td><span class="badge badge-success">${sanitizeHtml(admission.counselingType)}</span></td>
                        <td>${admission.createdAt ? new Date(admission.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('bams_admissions', '${admission.id}', document.getElementById('bams-${admission.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No BAMS admissions found</div>'}
        </div>

        <div class="section">
            <div class="section-header-with-export">
                <span>Newsletter Subscribers</span>
                <button class="btn btn-success" onclick="exportData('newsletters')">📥 Export</button>
            </div>
            ${enhancedNewsletters.length > 0 ? `
            <table class="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Subscribed Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${enhancedNewsletters.slice(0, 50).map(newsletter => `
                    <tr id="newsletter-${newsletter.id}" ${newsletter.isDuplicate ? 'class="duplicate-row"' : ''}>
                        <td>${sanitizeHtml(newsletter.email)} ${newsletter.isDuplicate ? '⚠️' : ''}</td>
                        <td>${newsletter.subscribedAt ? new Date(newsletter.subscribedAt).toLocaleDateString() : '-'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn btn-danger" onclick="deleteRecord('newsletters', '${newsletter.id}', document.getElementById('newsletter-${newsletter.id}'))">🗑️ Delete</button>
                            </div>
                        </td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            ` : '<div class="no-data">No newsletter subscribers found</div>'}
        </div>
    </div>
</body>
</html>`;

      res.send(html);
    } catch (error) {
      res.status(500).send('<h1>Error loading dashboard</h1>');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Move route setup to separate function
async function setupRoutes(app: Express) {
  // HTTPS redirect in production only
  if (process.env.NODE_ENV === 'production') {
    app.use(httpsRedirect);
  }
  
  // Apply security middleware
  app.use(securityMiddleware);
  
  // Apply rate limiting only in production
  if (process.env.NODE_ENV === 'production') {
    app.use('/api', rateLimiter);
  }
  
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 
    }
  }));

  // CSRF token endpoint
  app.get("/api/csrf-token", (req, res) => {
    const token = generateCSRFToken();
    res.json({ csrfToken: token });
  });

  // Lead submission endpoint
  app.post("/api/leads", validateLead, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      console.log('New lead submission saved:', leadData.name, leadData.email);
      
      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid data provided",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to create lead" 
        });
      }
    }
  });

  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch leads" 
      });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", validateNewsletter, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.subscribeNewsletter(newsletterData);
      
      console.log('New newsletter subscription saved:', newsletterData.email);
      
      res.json({ success: true, newsletter });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid email provided",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to subscribe to newsletter" 
        });
      }
    }
  });

  // Contact form submission endpoint
  app.post("/api/contacts", validateContact, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      console.log('Contact form submission received:', req.body);
      
      const contactData = insertContactSchema.parse(req.body);
      console.log('Contact data validated:', contactData);
      
      const contact = await storage.createContact(contactData);
      console.log('Contact saved successfully:', contact);
      
      console.log('New contact submission saved:', contactData.fullName, contactData.email);
      
      res.json({ success: true, contact });
    } catch (error) {
      console.error('Contact form error:', error);
      
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Invalid contact data provided",
          errors: error.errors 
        });
      } else {
        console.error('Database or other error:', (error as Error).message, (error as Error).stack);
        res.status(500).json({ 
          success: false, 
          message: "Failed to create contact",
          error: (error as Error).message 
        });
      }
    }
  });

  // Get all contacts
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contacts",
        error: (error as Error).message 
      });
    }
  });

  // Enhanced health check endpoint
  app.get("/api/health", async (req, res) => {
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: 'disconnected',
      memory: process.memoryUsage(),
    };

    try {
      const contacts = await storage.getContacts();
      healthCheck.database = 'connected';
      res.json({ 
        success: true,
        ...healthCheck,
        stats: {
          contactCount: contacts.length
        }
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({ 
        success: false,
        ...healthCheck,
        error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : (error as Error).message
      });
    }
  });

  // Get newsletter subscriptions
  app.get("/api/newsletters", async (req, res) => {
    try {
      const newsletters = await storage.getNewsletterSubscriptions();
      res.json(newsletters);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch newsletter subscriptions" 
      });
    }
  });
}
