export interface User {
  id: string;
  email: string;
  display_name?: string;
  avatar_url?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface BibleBook {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'Old' | 'New';
  book_order: number;
  chapter_count: number;
}

export interface BibleVerse {
  id: string;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
  search_vector?: string;
  search_vector?: string;
  book?: BibleBook;
}

export interface Circle {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  invite_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  members?: CircleMember[];
}

export interface CircleMember {
  id: string;
  circle_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  user?: User;
}

export interface Highlight {
  id: string;
  user_id: string;
  verse_id: string;
  start_offset: number;
  end_offset?: number;
  color: string;
  is_private: boolean;
  circle_id?: string;
  created_at: string;
  updated_at: string;
  verse?: BibleVerse;
}

export interface Note {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  note_type: 'scripture' | 'ministry' | 'personal';
  highlight_id?: string;
  verse_id?: string;
  is_private: boolean;
  circle_id?: string;
  search_vector?: string;
  created_at: string;
  updated_at: string;
  verse?: BibleVerse;
  highlight?: Highlight;
  tags?: Tag[];
}

export interface MinistryText {
  id: string;
  user_id: string;
  title: string;
  author?: string;
  content: string;
  source_url?: string;
  is_private: boolean;
  circle_id?: string;
  search_vector?: string;
  created_at: string;
  updated_at: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description?: string;
  duration_days: number;
  plan_type: 'sequential' | 'chronological' | 'thematic';
  is_preset: boolean;
  created_by?: string;
  plan_data?: any;
  plan_data?: any;
  created_at: string;
}

export interface UserReadingPlan {
  id: string;
  user_id: string;
  reading_plan_id: string;
  start_date: string;
  target_date: string;
  is_active: boolean;
  created_at: string;
  reading_plan?: ReadingPlan;
  progress?: ReadingProgress[];
}

export interface ReadingProgress {
  id: string;
  user_reading_plan_id: string;
  verse_id: string;
  read_count: number;
  last_read_at: string;
  verse?: BibleVerse;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  description?: string;
  color: string;
  description?: string;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'sepia';
  font_size: 'small' | 'medium' | 'large' | 'xl';
  tts_voice: string;
  tts_speed: number;
  tts_pitch: number;
  auto_sync: boolean;
  offline_mode: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchResult {
  type: 'verse' | 'note' | 'ministry';
  id: string;
  title: string;
  content: string;
  reference?: string;
  highlight?: string;
}

export interface ExportRequest {
  id: string;
  user_id: string;
  export_type: 'json' | 'pdf' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  file_url?: string;
  created_at: string;
  completed_at?: string;
}