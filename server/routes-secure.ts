import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertNewsletterSchema, insertContactSchema, insertBamsAdmissionSchema, insertBlogSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import compression from "compression";
import { body, validationResult } from "express-validator";
import { logger } from "./logger";
import { sanitizeInput, sanitizeForLog, sanitizeHtml, csrfProtection, validatePath, validateRedirectUrl, generateCSRFToken } from "./security";

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    csrfToken?: string;
  }
}

// Secure admin credentials from environment
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "$2b$12$FrhHWFzmcYacalhnT2gUyeCyLuAS8xJzs55ajyudyVrRVak6XLBhu";

// Security middleware
const securityMiddleware = [
  ...(process.env.NODE_ENV === 'production' ? [helmet({
    contentSecurityPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'same-origin' }
  })] : []),
  compression(),
  cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN 
      : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  }),
];

// HTTPS redirect middleware for production only
const httpsRedirect = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === 'production' && req.header('x-forwarded-proto') !== 'https') {
    const redirectUrl = `https://${req.header('host')}${req.url}`;
    if (validateRedirectUrl(redirectUrl, [req.header('host') || ''])) {
      res.redirect(redirectUrl);
    } else {
      res.status(400).send('Invalid redirect');
    }
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

const validateBlog = [
  body('title').trim().isLength({ min: 5, max: 200 }).escape(),
  body('slug').trim().isLength({ min: 5, max: 200 }).matches(/^[a-z0-9-]+$/),
  body('excerpt').trim().isLength({ min: 10, max: 500 }).escape(),
  body('content').trim().isLength({ min: 50, max: 50000 }),
  body('featuredImage').optional({ values: 'falsy' }).isURL(),
  body('tags').optional({ values: 'falsy' }).trim().isLength({ max: 200 }).escape(),
  body('status').isIn(['draft', 'published']),
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
    req.session.csrfToken = token;
    res.json({ csrfToken: token });
  });

  // Lead submission endpoint (public - no CSRF)
  app.post("/api/leads", validateLead, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      logger.info('New lead submission saved', {
        name: sanitizeForLog(leadData.name),
        email: sanitizeForLog(leadData.email)
      });
      
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

  // Newsletter subscription endpoint (public - no CSRF)
  app.post("/api/newsletter", validateNewsletter, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const newsletter = await storage.subscribeNewsletter(newsletterData);
      
      logger.info('New newsletter subscription saved', {
        email: sanitizeForLog(newsletterData.email)
      });
      
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

  // Contact form submission endpoint (public - no CSRF)
  app.post("/api/contacts", validateContact, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      logger.info('Contact form submission received');
      
      const contactData = insertContactSchema.parse(req.body);
      logger.info('Contact data validated');
      
      const contact = await storage.createContact(contactData);
      logger.info('Contact saved successfully');
      
      logger.info('New contact submission saved', {
        fullName: sanitizeForLog(contactData.fullName),
        email: sanitizeForLog(contactData.email)
      });
      
      res.json({ success: true, contact });
    } catch (error) {
      logger.error('Contact form error', { error: sanitizeForLog(error) });
      
      if (error instanceof z.ZodError) {
        logger.error('Validation errors', { errors: error.errors });
        res.status(400).json({ 
          success: false, 
          message: "Invalid contact data provided",
          errors: error.errors 
        });
      } else {
        logger.error('Database or other error', { 
          message: sanitizeForLog((error as Error).message)
        });
        res.status(500).json({ 
          success: false, 
          message: "Failed to create contact"
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
      logger.error('Failed to fetch contacts', { error: sanitizeForLog(error) });
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch contacts"
      });
    }
  });

  // BAMS admission submission endpoint (public - no CSRF)
  app.post("/api/bams-admissions", validateBamsAdmission, handleValidationErrors, async (req: Request, res: Response) => {
    try {
      logger.info('BAMS admission request received');
      
      const bamsData = insertBamsAdmissionSchema.parse(req.body);
      logger.info('BAMS admission data validated');
      
      const bamsAdmission = await storage.createBamsAdmission(bamsData);
      logger.info('BAMS admission saved successfully');
      
      logger.info('New BAMS admission saved', {
        fullName: sanitizeForLog(bamsData.fullName),
        email: sanitizeForLog(bamsData.email)
      });
      
      res.json({ 
        success: true, 
        message: 'BAMS admission inquiry submitted successfully! Our experts will contact you within 15 minutes.',
        id: bamsAdmission.id 
      });
    } catch (error) {
      logger.error('BAMS admission submission error', { error: sanitizeForLog(error) });
      
      if (error instanceof z.ZodError) {
        logger.error('BAMS validation errors', { errors: error.errors });
        res.status(400).json({ 
          success: false, 
          message: "Invalid BAMS admission data provided",
          errors: error.errors 
        });
      } else {
        logger.error('BAMS database or other error', {
          message: sanitizeForLog((error as Error).message)
        });
        res.status(500).json({ 
          success: false, 
          message: "Failed to submit BAMS admission inquiry"
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
      logger.error('Failed to fetch BAMS admissions', { error: sanitizeForLog(error) });
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch BAMS admissions"
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
        error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : sanitizeForLog((error as Error).message)
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

  // Blog endpoints
  app.get("/api/blogs", async (req, res) => {
    try {
      const blogs = await storage.getBlogs();
      const publishedBlogs = blogs.filter(blog => blog.status === 'published');
      res.json({ success: true, blogs: publishedBlogs });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch blogs" });
    }
  });

  app.get("/api/blogs/:slug", async (req, res) => {
    try {
      const blog = await storage.getBlogBySlug(req.params.slug);
      if (!blog || blog.status !== 'published') {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
      res.json({ success: true, blog });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch blog" });
    }
  });

  // Admin blog management
  app.get("/admin/blogs", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
      const blogs = await storage.getBlogs();
      res.json({ success: true, blogs });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch blogs" });
    }
  });

  app.post("/admin/blogs", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
      // Clean up empty strings to null for optional fields
      const cleanedData = {
        ...req.body,
        featuredImage: req.body.featuredImage || null,
        tags: req.body.tags || null
      };
      
      const blogData = insertBlogSchema.parse(cleanedData);
      const blog = await storage.createBlog(blogData);
      res.json({ success: true, blog });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid blog data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to create blog" });
      }
    }
  });

  app.put("/admin/blogs/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
      // Clean up empty strings to null for optional fields
      const cleanedData = {
        ...req.body,
        featuredImage: req.body.featuredImage || null,
        tags: req.body.tags || null
      };
      
      const blogData = insertBlogSchema.parse(cleanedData);
      const blog = await storage.updateBlog(req.params.id, blogData);
      res.json({ success: true, blog });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid blog data", errors: error.errors });
      } else {
        res.status(500).json({ success: false, message: "Failed to update blog" });
      }
    }
  });

  app.delete("/admin/blogs/:id", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    try {
      await storage.deleteBlog(req.params.id);
      res.json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete blog" });
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
        case 'blogs':
          await storage.deleteRecord('blogs', id as string);
          break;
        default:
          return res.status(400).json({ success: false, message: 'Invalid table' });
      }

      return res.json({ success: true, message: 'Record deleted successfully' });
    } catch (error) {
      logger.error('Delete error', { error: sanitizeForLog(error) });
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
      logger.error('Export error', { error: sanitizeForLog(error) });
      return res.status(500).json({ success: false, message: 'Failed to export data' });
    }
  });

  // Blog Manager Page
  app.get("/admin/blog-manager", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.redirect('/admin/login');
    }
    const fs = await import('fs');
    const path = await import('path');
    const htmlPath = path.resolve(process.cwd(), 'server', 'admin-blog-manager.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.send(html);
  });

  // Admin Data View (Protected)
  app.get("/admin/data", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.redirect('/admin/login');
    }
    const fs = await import('fs');
    const path = await import('path');
    const htmlPath = path.resolve(process.cwd(), 'server', 'admin-data-view.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    res.send(html);
  });

  // Admin Dashboard (Protected)
  app.get("/admin", async (req, res) => {
    if (!req.session.isAdmin) {
      return res.redirect('/admin/login');
    }
    try {
      const [leads, contacts, newsletters, bamsAdmissions, blogs] = await Promise.all([
        storage.getLeads(),
        storage.getContacts(),
        storage.getNewsletterSubscriptions(),
        storage.getBamsAdmissions(),
        storage.getBlogs()
      ]);

      const html = `<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard - AAS Eduguide</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #1a365d; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2rem; font-weight: bold; color: #7cb342; }
        .btn { padding: 10px 20px; margin: 5px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none; display: inline-block; }
        .btn-primary { background: #7cb342; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admin Dashboard</h1>
            <p>AAS Eduguide - All Admission Services</p>
            <a href="/admin/logout" style="color: white; float: right;">Logout</a>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${leads.length}</div>
                <div>Total Leads</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${contacts.length}</div>
                <div>Contact Forms</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${bamsAdmissions.length}</div>
                <div>BAMS Admissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${newsletters.length}</div>
                <div>Newsletter Subscribers</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${blogs.length}</div>
                <div>Blog Posts</div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="/admin/blog-manager" class="btn btn-primary">📝 Manage Blog Posts</a>
            <a href="/admin/data" class="btn btn-secondary">📊 View All Data</a>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3>Recent Blog Posts</h3>
            ${blogs.slice(0, 5).map(blog => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                    <strong>${sanitizeHtml(blog.title)}</strong>
                    <span style="background: ${blog.status === 'published' ? '#d4edda' : '#fff3cd'}; color: ${blog.status === 'published' ? '#155724' : '#856404'}; padding: 2px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px;">${blog.status}</span>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">${new Date(blog.createdAt).toLocaleDateString()}</div>
                </div>
            `).join('')}
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