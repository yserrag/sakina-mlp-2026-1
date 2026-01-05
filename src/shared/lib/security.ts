// [BLUEPRINT 3.3]: "Iron Dome" Security Protocol
// Implements Web Crypto API with AES-GCM for Zero-Knowledge Privacy.

// Helper: Convert string to buffer
const enc = new TextEncoder();
const dec = new TextDecoder();

// [FACTS]: We use a session-based key. In production, this comes from the User PIN.
// For MLP Skeleton, we generate a session key to demonstrate the "Volatile Memory" requirement.
let _sessionKey: CryptoKey | null = null;

export const SecurityService = {
  
  // 1. Initialize/Derive Key (Simulates Login)
  async initializeSession(): Promise<CryptoKey> {
    if (_sessionKey) return _sessionKey;
    
    // In a real PIN scenario, we would use PBKDF2 here (Blueprint Sec 3.3)
    // For now, we generate a fresh AES-GCM key for this session.
    _sessionKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );
    return _sessionKey;
  },

  // 2. Encrypt Data (The "Lock")
  async encrypt(data: any): Promise<{ ciphertext: ArrayBuffer; iv: Uint8Array }> {
    const key = await this.initializeSession();
    const encodedData = enc.encode(JSON.stringify(data));
    
    // [BLUEPRINT]: Generate random 12-byte IV for every operation [cite: 85]
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedData
    );

    return { ciphertext, iv };
  },

  // 3. Decrypt Data (The "Key")
  async decrypt(ciphertext: ArrayBuffer, iv: Uint8Array): Promise<any> {
    const key = await this.initializeSession();
    
    try {
      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        key,
        ciphertext
      );
      
      return JSON.parse(dec.decode(decryptedBuffer));
    } catch (e) {
      console.error("🔐 Decryption Failed: Invalid Key or Tampered Data");
      return null;
    }
  }
};