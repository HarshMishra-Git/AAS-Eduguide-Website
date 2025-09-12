// Secure API utilities with CSRF protection
import { sanitizeText } from './sanitize';

let csrfToken: string | null = null;

// Get CSRF token from server
export const getCSRFToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to get CSRF token');
    }
    
    const data = await response.json();
    csrfToken = data.csrfToken;
    return csrfToken || '';
  } catch (error) {
    console.error('Failed to get CSRF token:', error);
    return '';
  }
};

// Secure API request wrapper
export const secureRequest = async (url: string, options: RequestInit = {}) => {
  const token = await getCSRFToken();
  
  const secureOptions: RequestInit = {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token,
      ...options.headers,
    },
  };

  // Sanitize request body if it exists
  if (secureOptions.body && typeof secureOptions.body === 'string') {
    try {
      const bodyData = JSON.parse(secureOptions.body);
      const sanitizedData = Object.keys(bodyData).reduce((acc, key) => {
        acc[key] = typeof bodyData[key] === 'string' 
          ? sanitizeText(bodyData[key]) 
          : bodyData[key];
        return acc;
      }, {} as any);
      secureOptions.body = JSON.stringify(sanitizedData);
    } catch (error) {
      console.error('Failed to sanitize request body:', error);
    }
  }

  return fetch(url, secureOptions);
};

// API endpoints with CSRF protection
export const api = {
  // Submit lead form
  submitLead: async (data: any) => {
    return secureRequest('/api/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Submit contact form
  submitContact: async (data: any) => {
    return secureRequest('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Submit newsletter subscription
  submitNewsletter: async (data: any) => {
    return secureRequest('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Submit BAMS admission
  submitBamsAdmission: async (data: any) => {
    return secureRequest('/api/bams-admissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get health status
  getHealth: async () => {
    return fetch('/api/health', {
      method: 'GET',
      credentials: 'include',
    });
  },
};