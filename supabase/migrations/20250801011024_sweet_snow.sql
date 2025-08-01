/*
  # Populate Bible Data with Books and Sample Verses

  1. New Tables
    - Populates `bible_books` with all 66 books of the Bible
    - Populates `verses` with sample verses from various books
  
  2. Data Structure
    - Bible books with proper testament classification and ordering
    - Sample verses including Genesis creation, John 3:16, Psalm 23, etc.
    
  3. Conflict Resolution
    - Uses ON CONFLICT DO NOTHING to prevent duplicate insertions
    - Safe to run multiple times without errors
*/

-- Insert Bible Books (using ON CONFLICT DO NOTHING to prevent duplicates)
INSERT INTO bible_books (id, name, abbreviation, testament, book_order, chapter_count) VALUES
-- Old Testament
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

-- New Testament
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

-- Insert Sample Verses (using ON CONFLICT DO NOTHING to prevent duplicates)
INSERT INTO verses (book_id, chapter, verse, text) VALUES
-- Genesis 1 (Creation)
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

-- John 3:16 (Most famous verse)
(43, 3, 16, 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'),

-- Psalm 23 (The Lord is my shepherd)
(19, 23, 1, 'The Lord is my shepherd, I lack nothing.'),
(19, 23, 2, 'He makes me lie down in green pastures, he leads me beside quiet waters,'),
(19, 23, 3, 'he refreshes my soul. He guides me along the right paths for his name''s sake.'),
(19, 23, 4, 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.'),

-- Romans 8:28 (All things work together for good)
(45, 8, 28, 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'),

-- Philippians 4:13 (I can do all things)
(50, 4, 13, 'I can do all this through him who gives me strength.'),

-- Matthew 28:19-20 (Great Commission)
(40, 28, 19, 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,'),
(40, 28, 20, 'and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.'),

-- 1 Corinthians 13:4-7 (Love is patient)
(46, 13, 4, 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.'),
(46, 13, 5, 'It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.'),
(46, 13, 6, 'Love does not delight in evil but rejoices with the truth.'),
(46, 13, 7, 'It always protects, always trusts, always hopes, always perseveres.')
ON CONFLICT (book_id, chapter, verse) DO NOTHING;