import { supabase } from './supabase';
import type { BibleVerse } from '../types';

export async function searchBible(query: string, limit = 50): Promise<BibleVerse[]> {
  if (!query.trim()) return [];

  try {
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
      .limit(limit)
      .order('book_id')
      .order('chapter')
      .order('verse');

    if (error) {
      console.error('Search error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to search Bible:', error);
    throw error;
  }
}

export async function searchInBook(bookId: number, query: string): Promise<BibleVerse[]> {
  if (!query.trim()) return [];

  try {
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .eq('book_id', bookId)
      .textSearch('search_vector', query, {
        type: 'websearch',
        config: 'english'
      })
      .order('chapter')
      .order('verse');

    if (error) {
      console.error('Book search error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to search in book:', error);
    throw error;
  }
}

export async function getRandomVerse(): Promise<BibleVerse | null> {
  try {
    // Get a random verse using SQL function
    const { data, error } = await supabase
      .rpc('get_random_verse');

    if (error) {
      console.error('Random verse error:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Failed to get random verse:', error);
    return null;
  }
}