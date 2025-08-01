import { supabase } from '../lib/supabase';
import { searchBible, searchInBook } from '../lib/searchVerses';
import type { BibleBook, BibleVerse } from '../types';

export class BibleService {
  static async getBooks(): Promise<BibleBook[]> {
    console.log('🔍 BibleService: Fetching books from database...');
    
    try {
      // Test the connection first
      const { data: testData, error: testError } = await supabase
        .from('bible_books')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ BibleService: Connection test failed:', testError);
        throw testError;
      }
      
      console.log('✅ BibleService: Database connection successful');
    } catch (error) {
      console.error('❌ BibleService: Database connection failed:', error);
      throw error;
    }
    
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .order('book_order');

    if (error) {
      console.error('❌ BibleService: Database error fetching books:', error);
      console.error('❌ BibleService: Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
    
    console.log('📊 BibleService: Raw data received:', data);
    console.log('📊 BibleService: Books loaded successfully:', data?.length || 0, 'books');
    
    if (data && data.length > 0) {
      console.log('📖 BibleService: First few books:', data.slice(0, 3));
    }
    
    return data || [];
  }

  static async getBook(id: number): Promise<BibleBook | null> {
    const { data, error } = await supabase
      .from('bible_books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async getChapter(bookId: number, chapter: number): Promise<BibleVerse[]> {
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .eq('book_id', bookId)
      .eq('chapter', chapter)
      .order('verse');

    if (error) throw error;
    return data || [];
  }

  static async searchVerses(query: string, limit = 50, bookId?: number): Promise<BibleVerse[]> {
    try {
      if (bookId) {
        return await searchInBook(bookId, query);
      } else {
        return await searchBible(query, limit);
      }
    } catch (error) {
      console.error('Search verses error:', error);
      return [];
    }
  }

  static async searchInBook(bookId: number, query: string): Promise<BibleVerse[]> {
    return await searchInBook(bookId, query);
  }

  static async getVerse(bookId: number, chapter: number, verse: number): Promise<BibleVerse | null> {
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .eq('book_id', bookId)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .single();

    if (error) throw error;
    return data;
  }

  static async getRandomVerse(): Promise<BibleVerse | null> {
    // Get a random verse - this is a simplified approach
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .limit(1)
      .order('id', { ascending: false });

    if (error) throw error;
    return data?.[0] || null;
  }

  static async getVersesByIds(ids: string[]): Promise<BibleVerse[]> {
    const { data, error } = await supabase
      .from('verses')
      .select(`
        *,
        book:bible_books!verses_book_id_fkey(*)
      `)
      .in('id', ids);

    if (error) throw error;
    return data || [];
  }
}