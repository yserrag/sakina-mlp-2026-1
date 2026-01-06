import { openDB } from 'idb';

const DB_NAME = 'sakina-vault';
const STORE_NAME = 'encrypted-blobs';
const KEY_MATERIAL_STORE = 'key-material';
const ITERATIONS = 600000;
const ALGO = 'AES-GCM';
const HASH = 'SHA-256';

export class IronDome {
  private static async getDB() {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
        if (!db.objectStoreNames.contains(KEY_MATERIAL_STORE)) db.createObjectStore(KEY_MATERIAL_STORE);
      },
    });
  }

  private static async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: HASH },
      keyMaterial, { name: ALGO, length: 256 }, false, ['encrypt', 'decrypt']
    );
  }

  static async lock(key: string, data: any, userPin: string): Promise<void> {
    const db = await this.getDB();
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await this.deriveKey(userPin, salt);
    const encryptedContent = await window.crypto.subtle.encrypt({ name: ALGO, iv }, cryptoKey, encodedData);
    await db.put(STORE_NAME, { iv, content: encryptedContent }, key);
    await db.put(KEY_MATERIAL_STORE, salt, `${key}-salt`);
  }

  static async unlock(key: string, userPin: string): Promise<any | null> {
    try {
      const db = await this.getDB();
      const record = await db.get(STORE_NAME, key);
      const salt = await db.get(KEY_MATERIAL_STORE, `${key}-salt`);
      if (!record || !salt) return null;
      const cryptoKey = await this.deriveKey(userPin, salt);
      const decryptedContent = await window.crypto.subtle.decrypt({ name: ALGO, iv: record.iv }, cryptoKey, record.content);
      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedContent));
    } catch (error) {
      console.error('[SECURITY] Decryption Failed', error);
      return null;
    }
  }

  static async shredAllData(): Promise<void> {
    const db = await this.getDB();
    await db.clear(KEY_MATERIAL_STORE);
    await db.clear(STORE_NAME);
  }
}