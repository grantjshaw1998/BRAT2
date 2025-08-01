import React, { useState, useEffect } from 'react';
import { BibleService } from '../../services/bibleService';
import { useAuth } from '../../contexts/AuthContext';
import type { BibleBook, BibleVerse } from '../../types';
import { BookOpen, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BibleReader() {
  const { user } = useAuth();
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      loadChapter(selectedBook.id, selectedChapter);
    }
  }, [selectedBook, selectedChapter]);

  const loadBooks = async () => {
    try {
      console.log('📖 BibleReader: Starting to load books...');
      const booksData = await BibleService.getBooks();
      console.log('📖 BibleReader: Received books data:', booksData);
      setBooks(booksData);
      if (booksData.length > 0) {
        console.log('📖 BibleReader: Setting first book as selected:', booksData[0]);
        setSelectedBook(booksData[0]);
      } else {
        console.warn('⚠️ BibleReader: No books found in database');
      }
    } catch (error) {
      console.error('❌ BibleReader: Error loading books:', error);
      toast.error('Failed to load Bible books');
    } finally {
      console.log('🏁 BibleReader: Book loading completed');
      setLoading(false);
    }
  };

  const loadChapter = async (bookId: number, chapter: number) => {
    try {
      const versesData = await BibleService.getChapter(bookId, chapter);
      setVerses(versesData);
    } catch (error) {
      console.error('Error loading chapter:', error);
      toast.error('Failed to load chapter');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await BibleService.searchVerses(searchQuery, 50);
      setVerses(results);
      setSelectedBook(null);
      setSelectedChapter(0);
    } catch (error) {
      console.error('Error searching verses:', error);
      toast.error('Search failed');
    }
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!selectedBook) return;

    if (direction === 'prev' && selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else if (direction === 'next' && selectedChapter < selectedBook.chapter_count) {
      setSelectedChapter(selectedChapter + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Bible Reader</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verses..."
              className="px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Books Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">Books</h2>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {books.map(book => (
                <button
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setSelectedChapter(1);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedBook?.id === book.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {book.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedBook && (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {selectedBook.name} {selectedChapter}
                </h2>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigateChapter('prev')}
                    disabled={selectedChapter <= 1}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                    className="px-3 py-1 bg-gray-800 border border-gray-700 text-white rounded text-sm"
                  >
                    {Array.from({ length: selectedBook.chapter_count }, (_, i) => i + 1).map(ch => (
                      <option key={ch} value={ch}>Chapter {ch}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => navigateChapter('next')}
                    disabled={selectedChapter >= selectedBook.chapter_count}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verses */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            {verses.length > 0 ? (
              <div className="space-y-4">
                {verses.map(verse => (
                  <div key={verse.id} className="flex space-x-4">
                    <span className="text-blue-400 font-medium text-sm mt-1 min-w-[2rem]">
                      {verse.verse}
                    </span>
                    <p className="text-gray-300 leading-relaxed">
                      {verse.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchQuery ? 'No search results' : 'Select a book to start reading'}
                </h3>
                <p className="text-gray-400">
                  {searchQuery 
                    ? 'Try different search terms or browse by book and chapter.'
                    : 'Choose a book from the sidebar to begin your Bible study.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}