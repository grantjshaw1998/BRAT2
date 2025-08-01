import React, { useState, useEffect } from 'react';
import { searchBible } from '../../lib/searchVerses';
import { useBible } from '../../contexts/BibleContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchResults from './SearchResults';
import type { BibleBook, BibleVerse } from '../../types';
import { Search, Filter, BookOpen, FileText, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchResult {
  type: 'verse' | 'note' | 'ministry';
  id: string;
  title: string;
  content: string;
  reference?: string;
  highlight?: string;
}

export default function SearchInterface() {
  const { user } = useAuth();
  const { books, searchVerses } = useBible();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    includeVerses: true,
    includeNotes: true,
    includeMinistry: true,
    bookId: 'all' as string | 'all',
  });

  const handleSearch = async () => {
    if (!query.trim() || !user) return;

    setLoading(true);
    
    try {
      let searchResults: SearchResult[] = [];

      // Search verses using in-memory Bible data
      if (filters.includeVerses) {
        console.log(`🔍 Searching verses: "${query}"`);
        
        let verses: BibleVerse[] = [];
        if (filters.bookId !== 'all') {
          const bookId = parseInt(filters.bookId);
          verses = await searchBible(`${query} book_id:${bookId}`);
        } else {
          verses = await searchBible(query);
        }
        
        console.log(`✅ Found ${verses.length} verses`);
        
        searchResults.push(...verses.map(verse => ({
          type: 'verse' as const,
          id: verse.id,
          title: `${verse.book?.name} ${verse.chapter}:${verse.verse}`,
          content: verse.text,
          reference: `${verse.book?.abbreviation} ${verse.chapter}:${verse.verse}`,
          highlight: highlightSearchTerm(verse.text, query)
        })));
      }

      // TODO: Add notes and ministry text search here if needed
      
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast('No results found', { icon: '🔍' });
      } else {
        toast.success(`Found ${searchResults.length} results`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const highlightSearchTerm = (text: string, searchTerm: string): string => {
    if (!searchTerm.trim()) return text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'verse':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'note':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'ministry':
        return <Volume2 className="w-5 h-5 text-purple-600" />;
      default:
        return <Search className="w-5 h-5 text-gray-600" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'verse':
        return 'Scripture';
      case 'note':
        return 'Note';
      case 'ministry':
        return 'Ministry Text';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-4">Search</h1>
        
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search scriptures, notes, and ministry texts..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="flex items-center space-x-6 flex-wrap gap-y-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filter by:</span>
          </div>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.includeVerses}
              onChange={(e) => setFilters(prev => ({ ...prev, includeVerses: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Scripture</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.includeNotes}
              onChange={(e) => setFilters(prev => ({ ...prev, includeNotes: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Notes</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.includeMinistry}
              onChange={(e) => setFilters(prev => ({ ...prev, includeMinistry: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Ministry Texts</span>
          </label>

          <select
            value={filters.bookId}
            onChange={(e) => setFilters(prev => ({ ...prev, bookId: e.target.value }))}
            className="px-3 py-1 bg-gray-900 border border-gray-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Books</option>
            <optgroup label="Old Testament">
              {books.filter(book => book.testament === 'Old').map(book => (
                <option key={book.id} value={book.id.toString()}>
                  {book.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="New Testament">
              {books.filter(book => book.testament === 'New').map(book => (
                <option key={book.id} value={book.id.toString()}>
                  {book.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <SearchResults 
        results={results} 
        query={query} 
        loading={loading}
      />
    </div>
  );
}