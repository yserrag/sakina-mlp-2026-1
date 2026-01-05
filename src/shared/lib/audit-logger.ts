import { get, set } from 'idb-keyval';

export interface AuditLog {
  timestamp: string;
  modelUsed: 'LOCAL_NANO' | 'CLOUD_FLASH';
  userQuery: string; // Stored only if user enables "Spiritual Journaling"
  sourcesUsed: string[]; // IDs of Quran/Hadith verses retrieved
  complianceVerdict: 'PASS' | 'FLAGGED';
}

export const AuditLogger = {
  // MLP Requirement: Article 12 Record-Keeping [cite: 108]
  async logInteraction(log: Omit<AuditLog, 'timestamp'>) {
    const entry: AuditLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };

    const existingLogs = (await get<AuditLog[]>('sakina_audit_trail')) || [];
    
    // Limit local logs to last 100 entries to manage device storage
    const updatedLogs = [entry, ...existingLogs].slice(0, 100);
    
    await set('sakina_audit_trail', updatedLogs);
    console.log(`[AUDIT] AI Interaction logged: ${entry.timestamp}`);
  },

  async getLogs(): Promise<AuditLog[]> {
    return (await get<AuditLog[]>('sakina_audit_trail')) || [];
  }
};