import React, { createContext, useContext, useEffect, useState } from 'react';
import { BibleService } from '../services/bibleService';
import type { BibleBook, BibleVerse } from '../types';

interface BibleContextType {
  books: BibleBook[];
  verses: BibleVerse[];
  loading: boolean;
  error: string | null;
  searchVerses: (query: string) => BibleVerse[];
  getBook: (id: number) => BibleBook | undefined;
  getChapter: (bookId: number, chapter: number) => Promise<BibleVerse[]>;
}

const BibleContext = createContext<BibleContextType | undefined>(undefined);

export function BibleProvider({ children }: { children: React.ReactNode }) {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBibleData();
  }, []);

  const loadBibleData = async () => {
    try {
      console.log('🔥 BibleContext: Starting to load Bible data...');
      
      // Add a small delay to ensure Supabase connection is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const booksData = await BibleService.getBooks();
      console.log('📚 BibleContext: Received books data:', booksData);
      setBooks(booksData);
      console.log(`✅ BibleContext: Successfully loaded ${booksData.length} books`);
      
      // Load some initial verses for search functionality
      if (booksData.length > 0) {
        try {
          console.log('📖 BibleContext: Loading initial verses from first book...');
          const initialVerses = await BibleService.getChapter(1, 1); // Genesis 1
          console.log('📖 BibleContext: Initial verses loaded:', initialVerses.length);
          setVerses(initialVerses);
          console.log(`✅ BibleContext: Successfully loaded ${initialVerses.length} initial verses`);
        } catch (verseError) {
          console.warn('⚠️ BibleContext: Could not load initial verses:', verseError);
          setVerses([]);
        }
      } else {
        console.warn('⚠️ BibleContext: No books found in database');
      }
    } catch (err) {
      console.error('❌ BibleContext: Error loading Bible data:', err);
      setError('Failed to load Bible data. Please check your connection.');
      
      // Set some fallback data so the app doesn't break
      setBooks([]);
      setVerses([]);
    } finally {
      console.log('🏁 BibleContext: Bible data loading completed');
      setLoading(false);
    }
  };

  const searchVerses = (query: string): BibleVerse[] => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return verses.filter(verse => 
      verse.text.toLowerCase().includes(searchTerm)
    ).slice(0, 50); // Limit results
  };

  const getBook = (id: number): BibleBook | undefined => {
    return books.find(book => book.id === id);
  };

  const getChapter = async (bookId: number, chapter: number): Promise<BibleVerse[]> => {
    try {
      return await BibleService.getChapter(bookId, chapter);
    } catch (error) {
      console.error('Error loading chapter:', error);
      return [];
    }
  };

  const value = {
    books,
    verses,
    loading,
    error,
    searchVerses,
    getBook,
    getChapter
  };

  return (
    <BibleContext.Provider value={value}>
      {children}
    </BibleContext.Provider>
  );
}

export function useBible() {
  const context = useContext(BibleContext);
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider');
  }
  return context;
}