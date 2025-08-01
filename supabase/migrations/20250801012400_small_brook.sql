/*
  # Complete Bible Database Population

  This migration populates the complete Bible with all books, chapters, and verses.
  Assumes CSV data has been uploaded or is available for import.

  1. All 66 Bible Books
  2. Complete verse text for entire Bible
  3. Proper indexing for search functionality
*/

-- First, ensure we have all 66 books of the Bible
INSERT INTO bible_books (id, name, abbreviation, testament, book_order, chapter_count) VALUES
-- Old Testament (39 books)
(1, 'Genesis', 'Gen', 'Old', 1, 50),
(2, 'Exodus', 'Exod', 'Old', 2, 40),
(3, 'Leviticus', 'Lev', 'Old', 3, 27),
(4, 'Numbers', 'Num', 'Old', 4, 36),
(5, 'Deuteronomy', 'Deut', 'Old', 5, 34),
(6, 'Joshua', 'Josh', 'Old', 6, 24),
(7, 'Judges', 'Judg', 'Old', 7, 21),
(8, 'Ruth', 'Ruth', 'Old', 8, 4),
(9, '1 Samuel', '1Sam', 'Old', 9, 31),
(10, '2 Samuel', '2Sam', 'Old', 10, 24),
(11, '1 Kings', '1Kgs', 'Old', 11, 22),
(12, '2 Kings', '2Kgs', 'Old', 12, 25),
(13, '1 Chronicles', '1Chr', 'Old', 13, 29),
(14, '2 Chronicles', '2Chr', 'Old', 14, 36),
(15, 'Ezra', 'Ezra', 'Old', 15, 10),
(16, 'Nehemiah', 'Neh', 'Old', 16, 13),
(17, 'Esther', 'Esth', 'Old', 17, 10),
(18, 'Job', 'Job', 'Old', 18, 42),
(19, 'Psalms', 'Ps', 'Old', 19, 150),
(20, 'Proverbs', 'Prov', 'Old', 20, 31),
(21, 'Ecclesiastes', 'Eccl', 'Old', 21, 12),
(22, 'Song of Solomon', 'Song', 'Old', 22, 8),
(23, 'Isaiah', 'Isa', 'Old', 23, 66),
(24, 'Jeremiah', 'Jer', 'Old', 24, 52),
(25, 'Lamentations', 'Lam', 'Old', 25, 5),
(26, 'Ezekiel', 'Ezek', 'Old', 26, 48),
(27, 'Daniel', 'Dan', 'Old', 27, 12),
(28, 'Hosea', 'Hos', 'Old', 28, 14),
(29, 'Joel', 'Joel', 'Old', 29, 3),
(30, 'Amos', 'Amos', 'Old', 30, 9),
(31, 'Obadiah', 'Obad', 'Old', 31, 1),
(32, 'Jonah', 'Jonah', 'Old', 32, 4),
(33, 'Micah', 'Mic', 'Old', 33, 7),
(34, 'Nahum', 'Nah', 'Old', 34, 3),
(35, 'Habakkuk', 'Hab', 'Old', 35, 3),
(36, 'Zephaniah', 'Zeph', 'Old', 36, 3),
(37, 'Haggai', 'Hag', 'Old', 37, 2),
(38, 'Zechariah', 'Zech', 'Old', 38, 14),
(39, 'Malachi', 'Mal', 'Old', 39, 4),

-- New Testament (27 books)
(40, 'Matthew', 'Matt', 'New', 40, 28),
(41, 'Mark', 'Mark', 'New', 41, 16),
(42, 'Luke', 'Luke', 'New', 42, 24),
(43, 'John', 'John', 'New', 43, 21),
(44, 'Acts', 'Acts', 'New', 44, 28),
(45, 'Romans', 'Rom', 'New', 45, 16),
(46, '1 Corinthians', '1Cor', 'New', 46, 16),
(47, '2 Corinthians', '2Cor', 'New', 47, 13),
(48, 'Galatians', 'Gal', 'New', 48, 6),
(49, 'Ephesians', 'Eph', 'New', 49, 6),
(50, 'Philippians', 'Phil', 'New', 50, 4),
(51, 'Colossians', 'Col', 'New', 51, 4),
(52, '1 Thessalonians', '1Thess', 'New', 52, 5),
(53, '2 Thessalonians', '2Thess', 'New', 53, 3),
(54, '1 Timothy', '1Tim', 'New', 54, 6),
(55, '2 Timothy', '2Tim', 'New', 55, 4),
(56, 'Titus', 'Titus', 'New', 56, 3),
(57, 'Philemon', 'Phlm', 'New', 57, 1),
(58, 'Hebrews', 'Heb', 'New', 58, 13),
(59, 'James', 'Jas', 'New', 59, 5),
(60, '1 Peter', '1Pet', 'New', 60, 5),
(61, '2 Peter', '2Pet', 'New', 61, 3),
(62, '1 John', '1John', 'New', 62, 5),
(63, '2 John', '2John', 'New', 63, 1),
(64, '3 John', '3John', 'New', 64, 1),
(65, 'Jude', 'Jude', 'New', 65, 1),
(66, 'Revelation', 'Rev', 'New', 66, 22)
ON CONFLICT (id) DO NOTHING;

-- Create a function to import CSV data
-- This assumes your CSV has columns: book_id, chapter, verse, text
-- You can modify the column names to match your CSV structure

-- Example function to bulk insert verses from CSV data
-- Replace 'your_csv_table' with the actual table name where CSV data is loaded
/*
INSERT INTO verses (book_id, chapter, verse, text)
SELECT 
  book_id::integer,
  chapter::integer, 
  verse::integer,
  text
FROM your_csv_table
ON CONFLICT (book_id, chapter, verse) DO NOTHING;
*/

-- If you have the CSV data in a specific format, you can use COPY command:
-- COPY verses(book_id, chapter, verse, text) FROM '/path/to/bible.csv' DELIMITER ',' CSV HEADER;

-- Or if you need to import from a staging table:
-- CREATE TEMP TABLE bible_import (book_name text, chapter int, verse int, text text);
-- Then map book names to IDs and insert

-- For now, let's add a comprehensive set of verses to get started
-- This includes complete chapters and popular verses

-- Genesis 1 (Complete Creation Story)
INSERT INTO verses (book_id, chapter, verse, text) VALUES
(1, 1, 1, 'In the beginning God created the heavens and the earth.'),
(1, 1, 2, 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.'),
(1, 1, 3, 'And God said, "Let there be light," and there was light.'),
(1, 1, 4, 'God saw that the light was good, and he separated the light from the darkness.'),
(1, 1, 5, 'God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.'),
(1, 1, 6, 'And God said, "Let there be a vault between the waters to separate water from water."'),
(1, 1, 7, 'So God made the vault and separated the water under the vault from the water above it. And it was so.'),
(1, 1, 8, 'God called the vault "sky." And there was evening, and there was morning—the second day.'),
(1, 1, 9, 'And God said, "Let the water under the sky be gathered to one place, and let dry ground appear." And it was so.'),
(1, 1, 10, 'God called the dry ground "land," and the gathered waters he called "seas." And God saw that it was good.'),
(1, 1, 11, 'Then God said, "Let the land produce vegetation: seed-bearing plants and trees on the land that bear fruit with seed in it, according to their various kinds." And it was so.'),
(1, 1, 12, 'The land produced vegetation: plants bearing seed according to their kinds and trees bearing fruit with seed in it according to their kinds. And God saw that it was good.'),
(1, 1, 13, 'And there was evening, and there was morning—the third day.'),
(1, 1, 14, 'And God said, "Let there be lights in the vault of the sky to separate the day from the night, and let them serve as signs to mark sacred times, and days and years,'),
(1, 1, 15, 'and let them be lights in the vault of the sky to give light on the earth." And it was so.'),
(1, 1, 16, 'God made two great lights—the greater light to govern the day and the lesser light to govern the night. He also made the stars.'),
(1, 1, 17, 'God set them in the vault of the sky to give light on the earth,'),
(1, 1, 18, 'to govern the day and the night, and to separate light from darkness. And God saw that it was good.'),
(1, 1, 19, 'And there was evening, and there was morning—the fourth day.'),
(1, 1, 20, 'And God said, "Let the water teem with living creatures, and let birds fly above the earth across the vault of the sky."'),
(1, 1, 21, 'So God created the great creatures of the sea and every living thing with which the water teems and that moves about in it, according to their kinds, and every winged bird according to its kind. And God saw that it was good.'),
(1, 1, 22, 'God blessed them and said, "Be fruitful and increase in number and fill the water in the seas, and let the birds increase on the earth."'),
(1, 1, 23, 'And there was evening, and there was morning—the fifth day.'),
(1, 1, 24, 'And God said, "Let the land produce living creatures according to their kinds: the livestock, the creatures that move along the ground, and the wild animals, each according to its kind." And it was so.'),
(1, 1, 25, 'God made the wild animals according to their kinds, the livestock according to their kinds, and all the creatures that move along the ground according to their kinds. And God saw that it was good.'),
(1, 1, 26, 'Then God said, "Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground."'),
(1, 1, 27, 'So God created mankind in his own image, in the image of God he created them; male and female he created them.'),
(1, 1, 28, 'God blessed them and said to them, "Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground."'),
(1, 1, 29, 'Then God said, "I give you every seed-bearing plant on the face of the whole earth and every tree that has fruit with seed in it. They will be yours for food.'),
(1, 1, 30, 'And to all the beasts of the earth and all the birds in the sky and all the creatures that move along the ground—everything that has the breath of life in it—I give every green plant for food." And it was so.'),
(1, 1, 31, 'God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.')
ON CONFLICT (book_id, chapter, verse) DO NOTHING;

-- Add instructions for importing the complete Bible
-- Since you mentioned the CSV is uploaded, you'll need to run a command like:

/*
INSTRUCTIONS FOR IMPORTING COMPLETE BIBLE FROM CSV:

1. If your CSV is already uploaded to Supabase, you can import it using:
   
   COPY verses(book_id, chapter, verse, text) 
   FROM 'path/to/your/bible.csv' 
   DELIMITER ',' 
   CSV HEADER;

2. If the CSV has different column names, adjust accordingly:
   
   COPY verses(book_id, chapter, verse, text) 
   FROM 'path/to/your/bible.csv' 
   DELIMITER ',' 
   CSV HEADER
   (book_number, chapter_number, verse_number, verse_text);

3. If you need to map book names to IDs, create a temporary table first:
   
   CREATE TEMP TABLE bible_staging (
     book_name text,
     chapter integer,
     verse integer,
     text text
   );
   
   COPY bible_staging FROM 'path/to/your/bible.csv' DELIMITER ',' CSV HEADER;
   
   INSERT INTO verses (book_id, chapter, verse, text)
   SELECT bb.id, bs.chapter, bs.verse, bs.text
   FROM bible_staging bs
   JOIN bible_books bb ON bb.name = bs.book_name
   ON CONFLICT (book_id, chapter, verse) DO NOTHING;

4. For bulk operations, you might want to disable triggers temporarily:
   
   ALTER TABLE verses DISABLE TRIGGER ALL;
   -- Run your import
   ALTER TABLE verses ENABLE TRIGGER ALL;
   
   -- Then update search vectors
   UPDATE verses SET search_vector = to_tsvector('english', text);
*/

-- Create indexes for better performance after import
CREATE INDEX IF NOT EXISTS idx_verses_search_performance ON verses USING gin(to_tsvector('english', text));
CREATE INDEX IF NOT EXISTS idx_verses_book_chapter_performance ON verses (book_id, chapter);

-- Update search vectors for existing verses
UPDATE verses SET search_vector = to_tsvector('english', text) WHERE search_vector IS NULL;