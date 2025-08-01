import React, { useState, useEffect } from 'react';
import { NoteService } from '../../services/noteService';
import { TagService } from '../../services/tagService';
import { useAuth } from '../../contexts/AuthContext';
import type { Note, Tag } from '../../types';
import { FileText, Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import NoteEditor from './NoteEditor';

export default function NotesManager() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filters, setFilters] = useState({
    noteType: 'all',
    isPrivate: 'all',
    tagId: 'all'
  });

  useEffect(() => {
    if (user) {
      loadNotes();
      loadTags();
    }
  }, [user, filters]);

  const loadNotes = async () => {
    if (!user) return;

    try {
      const filterOptions: any = {};
      if (filters.noteType !== 'all') filterOptions.noteType = filters.noteType;
      if (filters.isPrivate !== 'all') filterOptions.isPrivate = filters.isPrivate === 'true';

      const notesData = await NoteService.getUserNotes(user.id, filterOptions);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const loadTags = async () => {
    if (!user) return;

    try {
      const tagsData = await TagService.getUserTags(user.id);
      setTags(tagsData);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await NoteService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleSaveNote = async (noteData: any) => {
    try {
      if (selectedNote) {
        const updatedNote = await NoteService.updateNote(selectedNote.id, noteData);
        setNotes(prev => prev.map(note => note.id === selectedNote.id ? updatedNote : note));
        toast.success('Note updated');
      } else {
        const newNote = await NoteService.createNote({
          ...noteData,
          user_id: user!.id
        });
        setNotes(prev => [newNote, ...prev]);
        toast.success('Note created');
      }
      setShowEditor(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  };

  const filteredNotes = notes.filter(note => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.content.toLowerCase().includes(query) ||
        note.title?.toLowerCase().includes(query) ||
        note.verse?.text.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getNoteTypeIcon = (type: string) => {
    switch (type) {
      case 'scripture':
        return '📖';
      case 'ministry':
        return '🎤';
      case 'personal':
        return '✍️';
      default:
        return '📝';
    }
  };

  if (showEditor) {
    return (
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onCancel={() => {
          setShowEditor(false);
          setSelectedNote(null);
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-black min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">My Notes</h1>
        <button
          onClick={handleCreateNote}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          <span>New Note</span>
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-400" />
          
          <select
            value={filters.noteType}
            onChange={(e) => setFilters(prev => ({ ...prev, noteType: e.target.value }))}
            className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="scripture">Scripture</option>
            <option value="ministry">Ministry</option>
            <option value="personal">Personal</option>
          </select>

          <select
            value={filters.isPrivate}
            onChange={(e) => setFilters(prev => ({ ...prev, isPrivate: e.target.value }))}
            className="px-4 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Privacy</option>
            <option value="true">Private</option>
            <option value="false">Shared</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 bg-black">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 border border-gray-700 rounded-lg">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Content</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
          {filteredNotes.map(note => (
            <tr key={note.id} className="hover:bg-gray-800 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getNoteTypeIcon(note.note_type)}</span>
                  <span className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-full font-medium">
                    {note.note_type}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-white font-semibold">
                  {note.title || 'Untitled Note'}
                </div>
                {!note.is_private && (
                  <span className="text-xs px-2 py-1 bg-blue-600 text-blue-200 rounded-full mt-1 inline-block">
                    Shared
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="text-gray-300 max-w-xs truncate">
                  {note.content}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {note.verse && (
                  <div className="text-blue-400 font-medium">
                    {note.verse.book?.abbreviation} {note.verse.chapter}:{note.verse.verse}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                {new Date(note.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-2 text-gray-500 hover:text-blue-400 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No notes found</h3>
          <p className="text-gray-400 mb-4">Start taking notes to organize your Bible study insights.</p>
          <button
            onClick={handleCreateNote}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Create Your First Note
          </button>
        </div>
      )}
    </div>
  );
}