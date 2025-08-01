import { supabase } from '../lib/supabase';
import type { Tag } from '../types';

export class TagService {
  static async createTag(tag: Omit<Tag, 'id' | 'created_at'>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserTags(userId: string): Promise<Tag[]> {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async updateTag(id: string, updates: Partial<Tag>): Promise<Tag> {
    const { data, error } = await supabase
      .from('tags')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteTag(id: string): Promise<void> {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}