import React, { useState, useEffect } from 'react';
import { TagService } from '../../services/tagService';
import { BibleService } from '../../services/bibleService';
import { useAuth } from '../../contexts/AuthContext';
import type { Note, Tag, BibleVerse } from '../../types';
import { Save, X, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface NoteEditorProps {
  note: Note | null;
  onSave: (noteData: any) => void;
  onCancel: () => void;
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [noteType, setNoteType] = useState(note?.note_type || 'personal');
  const [isPrivate, setIsPrivate] = useState(note?.is_private ?? true);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(note?.tags || []);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [verseSearch, setVerseSearch] = useState('');
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(note?.verse || null);

  useEffect(() => {
    if (user) {
      loadTags();
    }
  }, [user]);

  const loadTags = async () => {
    if (!user) return;

    try {
      const tags = await TagService.getUserTags(user.id);
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || !user) return;

    try {
      const newTag = await TagService.createTag({
        user_id: user.id,
        name: newTagName.trim(),
        color: '#3b82f6'
      });
      setAvailableTags(prev => [...prev, newTag]);
      setSelectedTags(prev => [...prev, newTag]);
      setNewTagName('');
      toast.success('Tag created');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const handleVerseSearch = async () => {
    if (!verseSearch.trim()) return;

    try {
      const results = await BibleService.searchVerses(verseSearch, 10);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching verses:', error);
      toast.error('Failed to search verses');
    }
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Note content is required');
      return;
    }

    const noteData = {
      title: title.trim() || undefined,
      content: content.trim(),
      note_type: noteType,
      is_private: isPrivate,
      verse_id: selectedVerse?.id || null,
      circle_id: null // TODO: Add circle selection
    };

    onSave(noteData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {note ? 'Edit Note' : 'Create New Note'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note Type
              </label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="personal">Personal</option>
                <option value="scripture">Scripture Study</option>
                <option value="ministry">Ministry Text</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {noteType === 'scripture' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Scripture
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={verseSearch}
                  onChange={(e) => setVerseSearch(e.target.value)}
                  placeholder="Search for verses..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleVerseSearch}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              {selectedVerse && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-2">
                  <div className="text-sm font-medium text-blue-900">
                    {selectedVerse.book?.name} {selectedVerse.chapter}:{selectedVerse.verse}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">{selectedVerse.text}</div>
                  <button
                    onClick={() => setSelectedVerse(null)}
                    className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Remove
                  </button>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                  {searchResults.map(verse => (
                    <button
                      key={verse.id}
                      onClick={() => {
                        setSelectedVerse(verse);
                        setSearchResults([]);
                        setVerseSearch('');
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {verse.book?.name} {verse.chapter}:{verse.verse}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{verse.text}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                  <button
                    onClick={() => setSelectedTags(prev => prev.filter(t => t.id !== tag.id))}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Create new tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !selectedTags.find(st => st.id === tag.id))
                .map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTags(prev => [...prev, tag])}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
                  >
                    {tag.name}
                  </button>
                ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Keep this note private</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Note</span>
          </button>
        </div>
      </div>
    </div>
  );
}