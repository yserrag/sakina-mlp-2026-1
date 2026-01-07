import { get, set, del } from 'idb-keyval';
import { supabase } from './supabase';

/**
 * THE IRON DOME STORAGE ENGINE
 * Principle: Local-First. 
 * Data lives on the device (IDB). Cloud is only for encrypted backup (Phase 2).
 */

export const storage = {
  /**
   * Save data.
   * 1. Writes to IndexedDB (Device) - Instant & Offline ready.
   * 2. (Future) Pushes encrypted blob to Supabase if user is logged in.
   */
  async set(key: string, value: any) {
    try {
      // 1. Critical: Save to Device
      await set(key, value);
      
      // 2. Optional: Cloud Sync (Placeholder for Phase 2)
      // if (supabase && userIsLoggedIn) { await uploadEncrypted(key, value); }
      
      console.log(`[Vault] Saved ${key} locally.`);
    } catch (err) {
      console.error('[Vault] Save Failed:', err);
    }
  },

  /**
   * Retrieve data.
   * 1. Tries Device (IDB) first.
   * 2. Returns null if missing.
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await get<T>(key);
      return value || null;
    } catch (err) {
      console.error('[Vault] Load Failed:', err);
      return null;
    }
  },

  /**
   * Remove data.
   * Wipes it from Device (and Future Cloud).
   */
  async remove(key: string) {
    await del(key);
    console.log(`[Vault] Wiped ${key}.`);
  }
};