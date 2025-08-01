import { supabase } from '../lib/supabase';
import type { Note, Tag } from '../types';

export class NoteService {
  static async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        ),
        highlight:highlights(*)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserNotes(userId: string, filters?: {
    noteType?: string;
    isPrivate?: boolean;
    circleId?: string;
  }): Promise<Note[]> {
    let query = supabase
      .from('notes')
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        ),
        highlight:highlights(*),
        tags:note_tags(
          tag:tags(*)
        )
      `)
      .eq('user_id', userId);

    if (filters?.noteType) {
      query = query.eq('note_type', filters.noteType);
    }
    if (filters?.isPrivate !== undefined) {
      query = query.eq('is_private', filters.isPrivate);
    }
    if (filters?.circleId) {
      query = query.eq('circle_id', filters.circleId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(note => ({
      ...note,
      tags: note.tags?.map((nt: any) => nt.tag) || []
    })) || [];
  }

  static async getNote(id: string): Promise<Note | null> {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        ),
        highlight:highlights(*),
        tags:note_tags(
          tag:tags(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      tags: data.tags?.map((nt: any) => nt.tag) || []
    } : null;
  }

  static async updateNote(id: string, updates: Partial<Note>): Promise<Note> {
    const { data, error } = await supabase
      .from('notes')
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
        ),
        highlight:highlights(*),
        tags:note_tags(
          tag:tags(*)
        )
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      tags: data.tags?.map((nt: any) => nt.tag) || []
    };
  }

  static async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async searchNotes(userId: string, query: string): Promise<Note[]> {
    const { data, error } = await supabase
      .from('notes')
      .select(`
        *,
        verse:verses(
          *,
          book:bible_books!verses_book_id_fkey(*)
        ),
        highlight:highlights(*),
        tags:note_tags(
          tag:tags(*)
        )
      `)
      .eq('user_id', userId)
      .textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(note => ({
      ...note,
      tags: note.tags?.map((nt: any) => nt.tag) || []
    })) || [];
  }

  static async addTagToNote(noteId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('note_tags')
      .insert({ note_id: noteId, tag_id: tagId });

    if (error) throw error;
  }

  static async removeTagFromNote(noteId: string, tagId: string): Promise<void> {
    const { error } = await supabase
      .from('note_tags')
      .delete()
      .eq('note_id', noteId)
      .eq('tag_id', tagId);

    if (error) throw error;
  }
}