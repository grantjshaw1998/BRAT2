import { supabase } from '../lib/supabase';
import type { Highlight } from '../types';

export class HighlightService {
  static async createHighlight(highlight: Omit<Highlight, 'id' | 'created_at' | 'updated_at'>): Promise<Highlight> {
    const { data, error } = await supabase
      .from('highlights')
      .insert(highlight)
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

  static async getUserHighlights(userId: string): Promise<Highlight[]> {
    const { data, error } = await supabase
      .from('highlights')
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getVerseHighlights(verseId: string, userId: string): Promise<Highlight[]> {
    const { data, error } = await supabase
      .from('highlights')
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        )
      `)
      .eq('verse_id', verseId)
      .or(`user_id.eq.${userId},and(is_private.eq.false,circle_id.is.not.null)`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateHighlight(id: string, updates: Partial<Highlight>): Promise<Highlight> {
    const { data, error } = await supabase
      .from('highlights')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
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

  static async deleteHighlight(id: string): Promise<void> {
    const { error } = await supabase
      .from('highlights')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getChapterHighlights(verseIds: string[], userId: string): Promise<Highlight[]> {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .in('verse_id', verseIds)
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  }
}