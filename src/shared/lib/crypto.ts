// Sakina 2.0 Master Encryption Protocol [cite: 81]
const ITERATIONS = 600000; 
const ALGO = 'AES-GCM';   

export async function deriveKey(pin: string, salt: Uint8Array) {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw', 
    encoder.encode(pin), 
    'PBKDF2', 
    false, 
    ['deriveKey']
  );
  
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: ALGO, length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// AES-GCM for confidentiality and integrity 
export async function encryptData(data: string, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12)); 
  const encoder = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGO, iv },
    key,
    encoder.encode(data)
  );
  return { ciphertext, iv };
}