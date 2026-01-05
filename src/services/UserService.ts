import { supabase } from '@/shared/api/supabase';

export class UserService {
  /**
   * getProfile
   * [FACTS]: Fetches the user's current progress across all pillars.
   */
  static async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * updateRevertStep
   * [FACTS]: Persists the current stage (1-5) of the Revert Journey.
   */
  static async updateRevertStep(step: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ revert_step: step })
      .eq('id', user.id);

    if (error) throw error;
  }

  static async updateXP(pointsToAdd: number): Promise<number | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('xp_points')
      .eq('id', user.id)
      .single();

    const newXP = (profile?.xp_points || 0) + pointsToAdd;

    const { error } = await supabase
      .from('profiles')
      .update({ xp_points: newXP })
      .eq('id', user.id);

    if (error) throw error;
    return newXP;
  }
}