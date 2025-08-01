import { supabase } from '../lib/supabase';
import type { ReadingPlan, UserReadingPlan, ReadingProgress } from '../types';

export class ReadingPlanService {
  static async getPresetPlans(): Promise<ReadingPlan[]> {
    const { data, error } = await supabase
      .from('reading_plans')
      .select('*')
      .eq('is_preset', true)
      .order('duration_days');

    if (error) throw error;
    return data || [];
  }

  static async createUserReadingPlan(plan: Omit<UserReadingPlan, 'id' | 'created_at'>): Promise<UserReadingPlan> {
    const { data, error } = await supabase
      .from('user_reading_plans')
      .insert(plan)
      .select(`
        *,
        reading_plan:reading_plans(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserReadingPlans(userId: string): Promise<UserReadingPlan[]> {
    const { data, error } = await supabase
      .from('user_reading_plans')
      .select(`
        *,
        reading_plan:reading_plans(*),
        progress:reading_progress(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async markVerseRead(userReadingPlanId: string, verseId: string): Promise<ReadingProgress> {
    // Check if progress already exists
    const { data: existing } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_reading_plan_id', userReadingPlanId)
      .eq('verse_id', verseId)
      .single();

    if (existing) {
      // Update read count
      const { data, error } = await supabase
        .from('reading_progress')
        .update({
          read_count: existing.read_count + 1,
          last_read_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select(`
          *,
          verse:verses(
            *,
            book:bible_books!verses_book_id_fkey(*)
          )
        `)
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('reading_progress')
        .insert({
          user_reading_plan_id: userReadingPlanId,
          verse_id: verseId,
          read_count: 1,
          last_read_at: new Date().toISOString()
        })
        .select(`
          *,
          verse:verses(
            *,
            book:bible_books!verses_book_id_fkey(*)
          )
        `)
        .single();

      if (error) throw error;
      return data;
    }
  }

  static async getReadingProgress(userReadingPlanId: string): Promise<ReadingProgress[]> {
    const { data, error } = await supabase
      .from('reading_progress')
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        )
      `)
      .eq('user_reading_plan_id', userReadingPlanId)
      .order('last_read_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateUserReadingPlan(id: string, updates: Partial<UserReadingPlan>): Promise<UserReadingPlan> {
    const { data, error } = await supabase
      .from('user_reading_plans')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        reading_plan:reading_plans(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getTodaysReading(userId: string): Promise<any[]> {
    // Get today's reading based on active reading plans
    const { data: activePlans } = await supabase
      .from('user_reading_plans')
      .select(`
        *,
        reading_plan:reading_plans(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!activePlans || activePlans.length === 0) {
      return [];
    }

    // For now, return a simple daily reading
    // In a full implementation, this would calculate based on the reading plan
    const { data: verses } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .limit(5);

    return verses || [];
  }
}