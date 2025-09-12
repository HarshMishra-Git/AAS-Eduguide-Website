// Web Vitals monitoring
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Performance observer for monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            // Sanitize entry data before logging
            const sanitizedEntry = {
              name: String(entry.name).slice(0, 100),
              duration: entry.duration,
              entryType: entry.entryType
            };
            console.log('Navigation timing:', sanitizedEntry);
          }
          if (entry.entryType === 'resource' && entry.duration > 1000) {
            // Sanitize resource name before logging
            const sanitizedName = String(entry.name).slice(0, 100);
            console.warn('Slow resource:', sanitizedName, entry.duration);
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (error) {
      console.warn('Performance monitoring not supported');
    }
  }
};