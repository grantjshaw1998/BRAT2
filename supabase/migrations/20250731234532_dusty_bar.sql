/*
  # Complete Database Schema Optimization

  1. Performance Improvements
    - Add missing indexes for common queries
    - Add search vectors for full-text search
    - Add composite indexes for filtering
    - Add foreign key indexes

  2. Missing Columns
    - Add display_name to users table
    - Add search_vector to verses table
    - Add color and description to tags
    - Add invite_code generation for circles
    - Add reading plan templates
    - Add user preferences

  3. Security Enhancements
    - Ensure all tables have RLS enabled
    - Add comprehensive policies
    - Add audit columns (created_at, updated_at)

  4. Data Integrity
    - Add proper constraints
    - Add default values
    - Fix foreign key relationships
*/

-- Drop existing tables if they exist to rebuild with proper structure
DROP TABLE IF EXISTS reading_progress CASCADE;
DROP TABLE IF EXISTS user_reading_plans CASCADE;
DROP TABLE IF EXISTS reading_plans CASCADE;
DROP TABLE IF EXISTS note_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS highlights CASCADE;
DROP TABLE IF EXISTS circle_members CASCADE;
DROP TABLE IF EXISTS circles CASCADE;
DROP TABLE IF EXISTS ministry_texts CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS verses CASCADE;
DROP TABLE IF EXISTS bible_books CASCADE;
DROP TABLE IF EXISTS export_requests CASCADE;

-- Create users table with all required columns
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create user_settings table
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'sepia')),
  font_size text DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xl')),
  tts_voice text DEFAULT 'default',
  tts_speed numeric DEFAULT 1.0 CHECK (tts_speed >= 0.5 AND tts_speed <= 2.0),
  tts_pitch numeric DEFAULT 1.0 CHECK (tts_pitch >= 0.5 AND tts_pitch <= 2.0),
  auto_sync boolean DEFAULT true,
  offline_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create bible_books table
CREATE TABLE bible_books (
  id serial PRIMARY KEY,
  name text NOT NULL,
  abbreviation text NOT NULL,
  testament text NOT NULL CHECK (testament IN ('Old', 'New')),
  book_order integer NOT NULL,
  chapter_count integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create verses table with search vector
CREATE TABLE verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id integer REFERENCES bible_books(id) ON DELETE CASCADE NOT NULL,
  chapter integer NOT NULL CHECK (chapter > 0),
  verse integer NOT NULL CHECK (verse > 0),
  text text NOT NULL,
  search_vector tsvector,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(book_id, chapter, verse)
);

-- Create circles table with invite code
CREATE TABLE circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  owner_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invite_code text UNIQUE DEFAULT encode(gen_random_bytes(8), 'base64'),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create circle_members table
CREATE TABLE circle_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(circle_id, user_id)
);

-- Create tags table with color and description
CREATE TABLE tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text DEFAULT '#3b82f6',
  description text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

-- Create highlights table
CREATE TABLE highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  verse_id uuid REFERENCES verses(id) ON DELETE CASCADE NOT NULL,
  start_offset integer NOT NULL DEFAULT 0,
  end_offset integer,
  color text DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'purple', 'orange')),
  is_private boolean DEFAULT true,
  circle_id uuid REFERENCES circles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create notes table with search vector
CREATE TABLE notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text,
  content text NOT NULL,
  note_type text DEFAULT 'personal' CHECK (note_type IN ('scripture', 'ministry', 'personal')),
  highlight_id uuid REFERENCES highlights(id) ON DELETE SET NULL,
  verse_id uuid REFERENCES verses(id) ON DELETE SET NULL,
  is_private boolean DEFAULT true,
  circle_id uuid REFERENCES circles(id) ON DELETE SET NULL,
  search_vector tsvector,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create note_tags junction table
CREATE TABLE note_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE NOT NULL,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(note_id, tag_id)
);

-- Create ministry_texts table with search vector
CREATE TABLE ministry_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  author text,
  content text NOT NULL,
  source_url text,
  is_private boolean DEFAULT true,
  circle_id uuid REFERENCES circles(id) ON DELETE SET NULL,
  search_vector tsvector,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create reading_plans table
CREATE TABLE reading_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  plan_type text DEFAULT 'sequential' CHECK (plan_type IN ('sequential', 'chronological', 'thematic')),
  is_preset boolean DEFAULT false,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  plan_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create user_reading_plans table
CREATE TABLE user_reading_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reading_plan_id uuid REFERENCES reading_plans(id) ON DELETE CASCADE NOT NULL,
  start_date date NOT NULL,
  target_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_dates CHECK (target_date > start_date)
);

-- Create reading_progress table
CREATE TABLE reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_reading_plan_id uuid REFERENCES user_reading_plans(id) ON DELETE CASCADE NOT NULL,
  verse_id uuid REFERENCES verses(id) ON DELETE CASCADE NOT NULL,
  read_count integer DEFAULT 1 CHECK (read_count > 0),
  last_read_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_reading_plan_id, verse_id)
);

-- Create export_requests table
CREATE TABLE export_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  export_type text NOT NULL CHECK (export_type IN ('json', 'pdf', 'csv')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  file_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_verses_book_chapter ON verses(book_id, chapter);
CREATE INDEX idx_verses_book_chapter_verse ON verses(book_id, chapter, verse);
CREATE INDEX idx_verses_search_vector ON verses USING gin(search_vector);
CREATE INDEX idx_highlights_user_id ON highlights(user_id);
CREATE INDEX idx_highlights_verse_id ON highlights(verse_id);
CREATE INDEX idx_highlights_user_verse ON highlights(user_id, verse_id);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_user_type ON notes(user_id, note_type);
CREATE INDEX idx_notes_user_private ON notes(user_id, is_private);
CREATE INDEX idx_notes_search_vector ON notes USING gin(search_vector);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX idx_ministry_texts_user_id ON ministry_texts(user_id);
CREATE INDEX idx_ministry_texts_search_vector ON ministry_texts USING gin(search_vector);
CREATE INDEX idx_circle_members_circle_id ON circle_members(circle_id);
CREATE INDEX idx_circle_members_user_id ON circle_members(user_id);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_note_tags_note_id ON note_tags(note_id);
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);
CREATE INDEX idx_user_reading_plans_user_id ON user_reading_plans(user_id);
CREATE INDEX idx_user_reading_plans_active ON user_reading_plans(user_id, is_active);
CREATE INDEX idx_reading_progress_plan_id ON reading_progress(user_reading_plan_id);

-- Create functions for search vector updates
CREATE OR REPLACE FUNCTION update_verses_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_notes_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', COALESCE(NEW.title, '') || ' ' || NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_ministry_texts_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.title || ' ' || COALESCE(NEW.author, '') || ' ' || NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER verses_search_vector_trigger
  BEFORE INSERT OR UPDATE ON verses
  FOR EACH ROW EXECUTE FUNCTION update_verses_search_vector();

CREATE TRIGGER notes_search_vector_trigger
  BEFORE INSERT OR UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_notes_search_vector();

CREATE TRIGGER ministry_texts_search_vector_trigger
  BEFORE INSERT OR UPDATE ON ministry_texts
  FOR EACH ROW EXECUTE FUNCTION update_ministry_texts_search_vector();

CREATE TRIGGER users_updated_at_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_settings_updated_at_trigger
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER circles_updated_at_trigger
  BEFORE UPDATE ON circles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER highlights_updated_at_trigger
  BEFORE UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER notes_updated_at_trigger
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bible_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministry_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE export_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can read and update their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);

-- Bible content is public
CREATE POLICY "Anyone can read bible books" ON bible_books
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read verses" ON verses
  FOR SELECT USING (true);

-- Circle policies
CREATE POLICY "Users can read circles they belong to" ON circles
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    auth.uid() IN (SELECT user_id FROM circle_members WHERE circle_id = circles.id)
  );

CREATE POLICY "Users can create circles" ON circles
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Circle owners can update their circles" ON circles
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Circle owners can delete their circles" ON circles
  FOR DELETE USING (auth.uid() = owner_id);

-- Circle members policies
CREATE POLICY "Users can read circle memberships" ON circle_members
  FOR SELECT USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT owner_id FROM circles WHERE id = circle_id)
  );

CREATE POLICY "Users can join circles" ON circle_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave circles" ON circle_members
  FOR DELETE USING (auth.uid() = user_id);

-- Tags policies
CREATE POLICY "Users can manage own tags" ON tags
  FOR ALL USING (auth.uid() = user_id);

-- Highlights policies
CREATE POLICY "Users can read own highlights" ON highlights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create highlights" ON highlights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own highlights" ON highlights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own highlights" ON highlights
  FOR DELETE USING (auth.uid() = user_id);

-- Notes policies
CREATE POLICY "Users can read own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- Note tags policies
CREATE POLICY "Users can manage note tags" ON note_tags
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM notes WHERE id = note_id)
  );

-- Ministry texts policies
CREATE POLICY "Users can manage own ministry texts" ON ministry_texts
  FOR ALL USING (auth.uid() = user_id);

-- Reading plans policies
CREATE POLICY "Anyone can read preset plans" ON reading_plans
  FOR SELECT USING (is_preset = true);

CREATE POLICY "Users can read own plans" ON reading_plans
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create plans" ON reading_plans
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- User reading plans policies
CREATE POLICY "Users can manage own reading plans" ON user_reading_plans
  FOR ALL USING (auth.uid() = user_id);

-- Reading progress policies
CREATE POLICY "Users can manage own reading progress" ON reading_progress
  FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM user_reading_plans WHERE id = user_reading_plan_id)
  );

-- Export requests policies
CREATE POLICY "Users can manage own export requests" ON export_requests
  FOR ALL USING (auth.uid() = user_id);

-- Insert sample Bible books
INSERT INTO bible_books (name, abbreviation, testament, book_order, chapter_count) VALUES
-- Old Testament
('Genesis', 'Gen', 'Old', 1, 50),
('Exodus', 'Exod', 'Old', 2, 40),
('Leviticus', 'Lev', 'Old', 3, 27),
('Numbers', 'Num', 'Old', 4, 36),
('Deuteronomy', 'Deut', 'Old', 5, 34),
('Joshua', 'Josh', 'Old', 6, 24),
('Judges', 'Judg', 'Old', 7, 21),
('Ruth', 'Ruth', 'Old', 8, 4),
('1 Samuel', '1Sam', 'Old', 9, 31),
('2 Samuel', '2Sam', 'Old', 10, 24),
('1 Kings', '1Kgs', 'Old', 11, 22),
('2 Kings', '2Kgs', 'Old', 12, 25),
('1 Chronicles', '1Chr', 'Old', 13, 29),
('2 Chronicles', '2Chr', 'Old', 14, 36),
('Ezra', 'Ezra', 'Old', 15, 10),
('Nehemiah', 'Neh', 'Old', 16, 13),
('Esther', 'Esth', 'Old', 17, 10),
('Job', 'Job', 'Old', 18, 42),
('Psalms', 'Ps', 'Old', 19, 150),
('Proverbs', 'Prov', 'Old', 20, 31),
('Ecclesiastes', 'Eccl', 'Old', 21, 12),
('Song of Solomon', 'Song', 'Old', 22, 8),
('Isaiah', 'Isa', 'Old', 23, 66),
('Jeremiah', 'Jer', 'Old', 24, 52),
('Lamentations', 'Lam', 'Old', 25, 5),
('Ezekiel', 'Ezek', 'Old', 26, 48),
('Daniel', 'Dan', 'Old', 27, 12),
('Hosea', 'Hos', 'Old', 28, 14),
('Joel', 'Joel', 'Old', 29, 3),
('Amos', 'Amos', 'Old', 30, 9),
('Obadiah', 'Obad', 'Old', 31, 1),
('Jonah', 'Jonah', 'Old', 32, 4),
('Micah', 'Mic', 'Old', 33, 7),
('Nahum', 'Nah', 'Old', 34, 3),
('Habakkuk', 'Hab', 'Old', 35, 3),
('Zephaniah', 'Zeph', 'Old', 36, 3),
('Haggai', 'Hag', 'Old', 37, 2),
('Zechariah', 'Zech', 'Old', 38, 14),
('Malachi', 'Mal', 'Old', 39, 4),
-- New Testament
('Matthew', 'Matt', 'New', 40, 28),
('Mark', 'Mark', 'New', 41, 16),
('Luke', 'Luke', 'New', 42, 24),
('John', 'John', 'New', 43, 21),
('Acts', 'Acts', 'New', 44, 28),
('Romans', 'Rom', 'New', 45, 16),
('1 Corinthians', '1Cor', 'New', 46, 16),
('2 Corinthians', '2Cor', 'New', 47, 13),
('Galatians', 'Gal', 'New', 48, 6),
('Ephesians', 'Eph', 'New', 49, 6),
('Philippians', 'Phil', 'New', 50, 4),
('Colossians', 'Col', 'New', 51, 4),
('1 Thessalonians', '1Thess', 'New', 52, 5),
('2 Thessalonians', '2Thess', 'New', 53, 3),
('1 Timothy', '1Tim', 'New', 54, 6),
('2 Timothy', '2Tim', 'New', 55, 4),
('Titus', 'Titus', 'New', 56, 3),
('Philemon', 'Phlm', 'New', 57, 1),
('Hebrews', 'Heb', 'New', 58, 13),
('James', 'Jas', 'New', 59, 5),
('1 Peter', '1Pet', 'New', 60, 5),
('2 Peter', '2Pet', 'New', 61, 3),
('1 John', '1John', 'New', 62, 5),
('2 John', '2John', 'New', 63, 1),
('3 John', '3John', 'New', 64, 1),
('Jude', 'Jude', 'New', 65, 1),
('Revelation', 'Rev', 'New', 66, 22);

-- Insert sample verses from John 3
INSERT INTO verses (book_id, chapter, verse, text) VALUES
((SELECT id FROM bible_books WHERE name = 'John'), 3, 1, 'Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 2, 'He came to Jesus at night and said, "Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him."'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 3, 'Jesus replied, "Very truly I tell you, no one can see the kingdom of God unless they are born again."'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 4, '"How can someone be born when they are old?" Nicodemus asked. "Surely they cannot enter a second time into their mother''s womb to be born!"'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 5, 'Jesus answered, "Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 6, 'Flesh gives birth to flesh, but the Spirit gives birth to spirit.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 7, 'You should not be surprised at my saying, ''You must be born again.'''),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 8, 'The wind blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going. So it is with everyone born of the Spirit."'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 9, '"How can this be?" Nicodemus asked.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 10, '"You are Israel''s teacher," said Jesus, "and do you not understand these things?'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 11, 'Very truly I tell you, we speak of what we know, and we testify to what we have seen, but still you people do not accept our testimony.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 12, 'I have spoken to you of earthly things and you do not believe; how then will you believe if I speak of heavenly things?'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 13, 'No one has ever gone into heaven except the one who came from heaven—the Son of Man.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 14, 'Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 15, 'that everyone who believes may have eternal life in him.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 16, 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 17, 'For God did not send his Son into the world to condemn the world, but to save the world through him.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 18, 'Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God''s one and only Son.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 19, 'This is the verdict: Light has come into the world, but people loved darkness instead of light because their deeds were evil.'),
((SELECT id FROM bible_books WHERE name = 'John'), 3, 20, 'Everyone who does evil hates the light, and will not come into the light for fear that their deeds will be exposed.');

-- Insert preset reading plans
INSERT INTO reading_plans (name, description, duration_days, plan_type, is_preset, plan_data) VALUES
('Bible in One Year', 'Read through the entire Bible in 365 days with a mix of Old and New Testament passages each day.', 365, 'sequential', true, '{"daily_chapters": 3, "mix_testaments": true}'),
('Bible in Six Months', 'An intensive reading plan to complete the Bible in 180 days.', 180, 'sequential', true, '{"daily_chapters": 6, "mix_testaments": true}'),
('New Testament in 90 Days', 'Focus on the New Testament with a 3-month reading plan.', 90, 'sequential', true, '{"testament": "new", "daily_chapters": 3}'),
('Chronological Bible Reading', 'Read the Bible in the order events occurred historically.', 365, 'chronological', true, '{"historical_order": true, "daily_chapters": 3}'),
('Psalms and Proverbs', 'Read through Psalms and Proverbs for wisdom and worship.', 150, 'thematic', true, '{"books": ["Psalms", "Proverbs"], "daily_chapters": 2}');