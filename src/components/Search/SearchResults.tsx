import React from 'react';
import { BookOpen, FileText, Volume2 } from 'lucide-react';

interface SearchResult {
  type: 'verse' | 'note' | 'ministry';
  id: string;
  title: string;
  content: string;
  reference?: string;
  highlight?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  loading?: boolean;
}

export default function SearchResults({ results, query, loading }: SearchResultsProps) {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'verse':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'note':
        return <FileText className="w-5 h-5 text-green-600" />;
      case 'ministry':
        return <Volume2 className="w-5 h-5 text-purple-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-400">Searching...</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Search the Bible</h3>
        <p className="text-gray-400">
          Enter keywords to search through scriptures, notes, and ministry texts.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
        <p className="text-gray-400">
          Try different search terms or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Search Results ({results.length})
      </h2>
      
      {results.map((result, index) => (
        <div 
          key={`${result.type}-${result.id}-${index}`} 
          className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-start space-x-3">
            {getResultIcon(result.type)}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-white">{result.title}</h3>
                <span className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded-full">
                  {getResultTypeLabel(result.type)}
                </span>
                {result.reference && (
                  <span className="text-sm text-gray-400">• {result.reference}</span>
                )}
              </div>
              <div 
                className="text-gray-300 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: result.highlight || result.content 
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}