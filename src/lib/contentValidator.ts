/**
 * Sakina Content Policy Validator
 * Blueprint 8.2: Shariah Compliance & CPRA Privacy Guardrails
 */

export interface Recommendation {
  id: string;
  trigger: 'travel' | 'fajr' | 'friday' | 'general';
  title: string;
  description: string;
  icon: any;
  actionLabel: string;
  link: string;
  color: string;
}

const APPROVED_DOMAINS = [
  'halalbooking.com',
  'launchgood.com',
  'amazon.com',
  'islamicrelief.org',
  'zakathouse.org',
  'trip.com',
  'sakina.app'
];

const HARAM_KEYWORDS = [
  // Alcohol
  'alcohol', 'wine', 'beer', 'vodka', 'whiskey', 'champagne', 'liquor', 'cocktail',
  // Gambling
  'casino', 'gambling', 'poker', 'slots', 'lottery', 'betting', 'wager',
  // Inappropriate
  'dating', 'hookup', 'nightclub', 'adult', 'escort', 'bikini',
  // Financial Haram
  'interest rate', 'payday loan', 'riba', 'usury', 'forex leverage',
  // Food (Added via Audit)
  'pork', 'bacon', 'ham', 'lard', 'gelatin', 'pepperoni',
  // Esoteric (Added via Audit)
  'astrology', 'horoscope', 'tarot', 'fortune', 'zodiac',
  // Music/Nightlife (Added via Audit)
  'music festival', 'concert', 'rave', 'dance club'
];

export class ContentValidator {
  
  /**
   * Validates affiliate recommendation against Shariah policy
   * Fail-Closed Architecture: If in doubt, block it.
   */
  static validateRecommendation(rec: Recommendation): boolean {
    try {
      // 1. URL Protocol Check (Prevent Javascript injection)
      const url = new URL(rec.link);
      if (!['https:', 'http:'].includes(url.protocol)) return false;

      // 2. Domain Allowlist
      const isDomainApproved = APPROVED_DOMAINS.some(domain => 
        url.hostname === domain || url.hostname.endsWith(`.${domain}`)
      );
      
      if (!isDomainApproved) {
        console.error('[HARAM FILTER] ❌ Blocked unauthorized domain:', url.hostname);
        return false;
      }
      
      // 3. Content Screening (Title + Description + Button)
      const combinedText = `${rec.title} ${rec.description} ${rec.actionLabel}`.toLowerCase();
      const foundHaram = HARAM_KEYWORDS.find(keyword => combinedText.includes(keyword));
      
      if (foundHaram) {
        console.error('[HARAM FILTER] ❌ Blocked haram keyword:', foundHaram);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.error('[HARAM FILTER] ❌ Validation error:', error);
      return false; // Fail closed
    }
  }
  
  /**
   * Sanitizes outbound affiliate links (CPRA Compliance)
   * Strips ad-tracking parameters (GCLID, FBCLID)
   */
  static sanitizeAffiliateLink(link: string): string {
    try {
      const url = new URL(link);
      
      // Whitelist only functional params
      const allowedParams = ['ref', 'tag', 'k', 's', 'dest'];
      const params = new URLSearchParams(url.search);
      const sanitized = new URLSearchParams();
      
      allowedParams.forEach(param => {
        if (params.has(param)) {
          sanitized.set(param, params.get(param)!);
        }
      });
      
      url.search = sanitized.toString();
      return url.toString();
      
    } catch (error) {
      return link; // Return original if parsing fails (safe default)
    }
  }
}

export const logAffiliateClick = (recId: string, destination: string) => {
  // Privacy-preserving audit trail (No PII, No IP)
  const logEntry = {
    timestamp: new Date().toISOString(),
    recommendationId: recId,
    destinationDomain: new URL(destination).hostname,
  };
  
  // In production, send to your privacy-focused analytics
  console.log('[AFFILIATE AUDIT]', logEntry);
};