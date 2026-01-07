/**
 * THE IRON DOME CONTENT VALIDATOR
 * Enforces Shariah compliance and Safety guardrails locally.
 */

export class ContentValidator {
  
    // 1. FATWA BLOCKLIST: Terms that trigger a "Consult a Scholar" warning
    // We do NOT let AI answer legal rulings (Divorce, Inheritance, Fiqh).
    private static FATWA_TRIGGERS = [
      'divorce', 'talaq', 'inheritance', 'marriage invalid', 
      'is it haram to', 'fatwa', 'ruling on', 'interest rate',
      'calculate share', 'custody'
    ];
  
    // 2. HARAM KEYWORDS: Immediate Red Flags for content
    private static HARAM_KEYWORDS = [
      'pork', 'wine', 'beer', 'vodka', 'gambling', 'casino', 
      'horoscope', 'shirk', 'fortune telling'
    ];
  
    /**
     * SAFETY CHECK 1: Input Sanitization
     * Prevents "Jailbreak" attempts (e.g., "Ignore previous instructions").
     */
    static validateInput(text: string): { safe: boolean; reason?: string } {
      const lower = text.toLowerCase();
  
      // Check for Fatwa requests
      if (this.FATWA_TRIGGERS.some(t => lower.includes(t))) {
        return { 
          safe: false, 
          reason: 'This query appears to request a specific Fatwa (Legal Ruling). Please consult a qualified local scholar for Fiqh matters.' 
        };
      }
  
      // Check for Malicious Prompt Injection
      if (lower.includes('ignore previous') || lower.includes('act as a developer')) {
        return { safe: false, reason: 'System safety guidelines prevented this request.' };
      }
  
      return { safe: true };
    }
  
    /**
     * SAFETY CHECK 2: Output Verification
     * Ensures the AI didn't hallucinate something dangerous.
     */
    static validateResponse(text: string): boolean {
      const lower = text.toLowerCase();
      
      // If the AI starts generating unverified Quranic verses (Hallucination Risk)
      // We strictly block it unless it cites a source (simple heuristic for MLP)
      if (lower.includes('quran says') && !lower.includes('surah')) {
        return false; 
      }
  
      return true;
    }
  }