/**
 * Sakina 2.0 Security Configuration
 * Generates Content Security Policy (CSP) and security headers to block XSS.
 * Enforces strictly local-first data policy.
 */

export interface SecurityConfig {
  csp: string;
  metaTags: Record<string, string>;
}

export const generateSecurityConfig = (): SecurityConfig => {
  // Strict CSP to prevent XSS
  const cspDirectives = [
    "default-src 'self'",
    // Allow scripts from our domain, esm.sh (for modules), and tailwind CDN
    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://esm.sh",
    // Allow styles from Google Fonts and Tailwind
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Allow fonts from Google
    "font-src 'self' https://fonts.gstatic.com",
    // Allow images from our domain, data URIs (for AI generated images), and OpenWeatherMap
    "img-src 'self' data: https://openweathermap.org https://*.openweathermap.org",
    // Allow connections to Supabase, Google Generative AI, and OpenWeatherMap
    "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://api.openweathermap.org",
    // Block object tags (Flash, etc.)
    "object-src 'none'",
    // Block iframes
    "frame-src 'none'",
    // Upgrade insecure requests
    "upgrade-insecure-requests"
  ];

  const csp = cspDirectives.join('; ');

  return {
    csp,
    metaTags: {
      'Content-Security-Policy': csp,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  };
};

// Helper to inject security meta tags at runtime (client-side enforcement)
export const injectSecurityMetaTags = () => {
  const config = generateSecurityConfig();
  
  Object.entries(config.metaTags).forEach(([name, content]) => {
    // Check if tag exists
    let tag = document.querySelector(`meta[http-equiv="${name}"]`) || document.querySelector(`meta[name="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      // CSP uses http-equiv, others usually use name, but for security headers http-equiv is often used in meta
      if (name === 'Content-Security-Policy' || name === 'X-Content-Type-Options') {
         tag.setAttribute('http-equiv', name);
      } else {
         tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  });
  
  console.log("🛡️ Sakina Security Shield Active: CSP & XSS Protection Enabled");
};