import { get, set, del } from 'idb-keyval';
import { SecurityService } from './security';

// [BLUEPRINT 2.1]: Local-First "Source of Truth"
export const STORAGE_KEYS = {
  USER_SESSION: 'sakina_user_session',
  THEME_PREF: 'sakina_theme',
  HOME_LOCATION: 'sakina_home_loc',
  PRAYER_ADJUSTMENTS: 'sakina_adjustments',
  QURAN_BOOKMARKS: 'sakina_bookmarks',
  // [BLUEPRINT 3.3]: Sensitive data logs
  SPIRITUAL_JOURNAL: 'sakina_journal_encrypted' 
};

export const SovereignStorage = {
  // Public Data (No Encryption needed, e.g. Theme)
  async savePublic(key: string, value: any) {
    await set(key, value);
  },

  async loadPublic(key: string, fallback: any) {
    return (await get(key)) || fallback;
  },

  // [BLUEPRINT 3.3]: "Encryption at Rest" for Sensitive Data
  async saveSecure(key: string, value: any) {
    const { ciphertext, iv } = await SecurityService.encrypt(value);
    // Store as a bundle: { data, iv }
    // We strictly avoid storing plain text logs [cite: 79]
    await set(key, { 
      data: Array.from(new Uint8Array(ciphertext)), // Store as array for IDB compatibility
      iv: Array.from(iv) 
    });
  },

  async loadSecure(key: string, fallback: any) {
    const record = await get(key);
    if (!record) return fallback;

    // Rehydrate arrays back to Buffers
    const ciphertext = new Uint8Array(record.data).buffer;
    const iv = new Uint8Array(record.iv);

    return await SecurityService.decrypt(ciphertext, iv) || fallback;
  }
};