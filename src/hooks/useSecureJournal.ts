import { useState, useCallback } from 'react';
import { IronDome } from '../lib/security';

export interface JournalEntry {
  id: string;
  timestamp: string;
  mood: 'grateful' | 'anxious' | 'hopeful' | 'sad';
  text: string;
  tags: string[];
}

// Ensure this line starts with 'export const'
export const useSecureJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveEntry = useCallback(async (entry: JournalEntry, userPin: string) => {
    setLoading(true);
    setError(null);
    try {
      await IronDome.lock(entry.id, entry, userPin);
      setEntries(prev => [entry, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to encrypt entry.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadEntries = useCallback(async (entryIds: string[], userPin: string) => {
    setLoading(true);
    setError(null);
    const decrypted: JournalEntry[] = [];
    try {
      for (const id of entryIds) {
        const data = await IronDome.unlock(id, userPin);
        if (data) decrypted.push(data);
      }
      setEntries(decrypted.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (err) {
      setError('Decryption failed.');
    } finally {
      setLoading(false);
    }
  }, []);

  const obliterateData = useCallback(async () => {
    if (window.confirm("ARE YOU SURE? This will destroy the encryption keys.")) {
      await IronDome.shredAllData();
      setEntries([]);
      alert("Sanctuary wiped clean.");
    }
  }, []);

  return { entries, loading, error, saveEntry, loadEntries, obliterateData };
};