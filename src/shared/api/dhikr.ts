import { supabase } from './supabase'; // [FACTS]: Staying in shared/api/ boundary
import { DhikrSession } from '@/entities/user/model/store';

export const DhikrAPI = {
  /**
   * Syncs the current count to the database.
   * [ANALYSIS]: Uses upsert to maintain a single record per user/phrase.
   */
  async syncCount(session: DhikrSession) {
    const { data, error } = await supabase
      .from('dhikr_logs')
      .upsert({
        user_id: session.user_id,
        count: session.count,
        phrase: session.phrase,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },

  async getLatestCount(userId: string, phrase: string) {
    const { data, error } = await supabase
      .from('dhikr_logs')
      .select('count')
      .eq('user_id', userId)
      .eq('phrase', phrase)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.count || 0;
  }
};