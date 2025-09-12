// Comprehensive security configuration
export const securityConfig = {
  // CORS settings
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? (process.env.CORS_ORIGIN || '').split(',').filter(Boolean)
      : ['http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
    maxAge: 86400, // 24 hours
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
  },

  // Helmet security headers
  helmet: {
    contentSecurityPolicy: false,
    hsts: process.env.NODE_ENV === 'production' ? {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    } : false,
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'same-origin' },
    frameguard: { action: 'deny' },
    dnsPrefetchControl: { allow: false },
    ieNoOpen: true,
    hidePoweredBy: true,
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId', // Don't use default session name
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict' as const,
    },
  },

  // Input validation limits
  validation: {
    maxStringLength: 1000,
    maxEmailLength: 254,
    maxPhoneLength: 20,
    maxMessageLength: 2000,
    maxNameLength: 100,
  },

  // File upload restrictions (if needed in future)
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles: 5,
  },

  // Logging configuration
  logging: {
    maxLogLength: 1000,
    sanitizeUserInput: true,
    logLevel: process.env.LOG_LEVEL || 'info',
  },

  // Admin security
  admin: {
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    sessionTimeout: 60 * 60 * 1000, // 1 hour
  },
};

// Security middleware configuration
export const getSecurityMiddleware = () => {
  return {
    cors: securityConfig.cors,
    rateLimit: securityConfig.rateLimit,
    helmet: securityConfig.helmet,
    session: securityConfig.session,
  };
};