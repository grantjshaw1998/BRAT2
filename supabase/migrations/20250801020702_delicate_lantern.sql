/*
  # Clear All Bible Text Data

  This migration removes all Bible text content from the database while preserving the app structure.

  1. Data Removal
    - Delete all verses from `verses` table
    - Delete all Bible books from `bible_books` table
    - Clear any Bible-related cached data

  2. Preserve Structure
    - Keep all table schemas intact
    - Keep all user data (notes, highlights, etc.)
    - Keep all app functionality
*/

-- Clear all Bible verses (this removes all the actual Bible text)
DELETE FROM verses;

-- Clear all Bible books
DELETE FROM bible_books;

-- Reset any sequences if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'bible_books_id_seq') THEN
    ALTER SEQUENCE bible_books_id_seq RESTART WITH 1;
  END IF;
END $$;

-- Add a confirmation record
INSERT INTO bible_books (id, name, abbreviation, testament, book_order, chapter_count) 
VALUES (999, 'Bible Text Cleared', 'CLEARED', 'Old', 999, 0);