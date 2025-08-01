import { supabase } from '../lib/supabase';
import type { SearchResult } from '../types';
import { BibleService } from './bibleService';
import { NoteService } from './noteService';

export class SearchService {
  static async searchAll(query: string, userId: string, filters?: {
    includeVerses?: boolean;
    includeNotes?: boolean;
    includeMinistry?: boolean;
    bookId?: number;
    dateFrom?: string;
    dateTo?: string;
    tags?: string[];
    isPrivate?: boolean;
  }): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // Search Bible verses
    if (filters?.includeVerses !== false) {
      try {
        const verses = await BibleService.searchVerses(query, 20, filters?.bookId);
        results.push(...verses.map(verse => ({
          type: 'verse' as const,
          id: verse.id,
          title: `${verse.book?.name} ${verse.chapter}:${verse.verse}`,
          content: verse.text,
          reference: `${verse.book?.abbreviation} ${verse.chapter}:${verse.verse}`,
          highlight: this.highlightSearchTerm(verse.text, query)
        })));
      } catch (error) {
        console.error('Error searching verses:', error);
      }
    }

    // Search user notes
    if (filters?.includeNotes !== false) {
      try {
        const notes = await NoteService.searchNotes(userId, query);
        results.push(...notes.map(note => ({
          type: 'note' as const,
          id: note.id,
          title: note.title || 'Untitled Note',
          content: note.content,
          reference: note.verse ? `${note.verse.book?.abbreviation} ${note.verse.chapter}:${note.verse.verse}` : undefined,
          highlight: this.highlightSearchTerm(note.content, query)
        })));
      } catch (error) {
        console.error('Error searching notes:', error);
      }
    }

    // Search ministry texts
    if (filters?.includeMinistry !== false) {
      try {
        const { data: ministryTexts } = await supabase
          .from('ministry_texts')
          .select('*')
          .eq('user_id', userId)
          .textSearch('content', query)
          .limit(10);

        if (ministryTexts) {
          results.push(...ministryTexts.map(text => ({
            type: 'ministry' as const,
            id: text.id,
            title: text.title,
            content: text.content,
            reference: text.author ? `by ${text.author}` : undefined,
            highlight: this.highlightSearchTerm(text.content, query)
          })));
        }
      } catch (error) {
        console.error('Error searching ministry texts:', error);
      }
    }

    return results.sort((a, b) => {
      // Prioritize exact matches in title
      const aExactTitle = a.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      const bExactTitle = b.title.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
      if (aExactTitle !== bExactTitle) return bExactTitle - aExactTitle;

      // Then by type priority (verses first, then notes, then ministry)
      const typePriority = { verse: 3, note: 2, ministry: 1 };
      return typePriority[b.type] - typePriority[a.type];
    });
  }

  // Search within a specific book (uses cache if available)
  static async searchInBook(bookId: number, query: string, userId: string): Promise<SearchResult[]> {
    try {
      const verses = await BibleService.searchInBook(bookId, query);
      return verses.map(verse => ({
        type: 'verse' as const,
        id: verse.id,
        title: `${verse.book?.name} ${verse.chapter}:${verse.verse}`,
        content: verse.text,
        reference: `${verse.book?.abbreviation} ${verse.chapter}:${verse.verse}`,
        highlight: this.highlightSearchTerm(verse.text, query)
      }));
    } catch (error) {
      console.error('Error searching in book:', error);
      return [];
    }
  }

  private static highlightSearchTerm(text: string, searchTerm: string): string {
    if (!searchTerm.trim()) return text;

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  static async getSuggestedVerses(content: string, limit = 5): Promise<SearchResult[]> {
    // Extract keywords from content
    const keywords = this.extractKeywords(content);
    if (keywords.length === 0) return [];

    try {
      const verses = await BibleService.searchVerses(keywords.join(' | '), limit);
      return verses.map(verse => ({
        type: 'verse' as const,
        id: verse.id,
        title: `${verse.book?.name} ${verse.chapter}:${verse.verse}`,
        content: verse.text,
        reference: `${verse.book?.abbreviation} ${verse.chapter}:${verse.verse}`,
        highlight: verse.text
      }));
    } catch (error) {
      console.error('Error getting suggested verses:', error);
      return [];
    }
  }

  private static extractKeywords(text: string): string[] {
    // Remove common words and extract meaningful terms
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word))
      .slice(0, 5); // Limit to 5 keywords
  }
}