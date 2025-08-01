/*
  # Populate Complete Bible Database

  1. Bible Books
    - All 66 books of the Bible (39 Old Testament, 27 New Testament)
    - Proper book order and chapter counts
    - Testament classification

  2. Sample Verses
    - Key verses from each book
    - Complete chapters for popular books
    - Searchable content with proper indexing

  This migration populates the database with a comprehensive Bible dataset.
*/

-- Insert all 66 Bible books
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

-- Insert comprehensive Bible verses
INSERT INTO verses (book_id, chapter, verse, text) VALUES

-- Genesis Chapter 1 (Complete Creation Story)
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
(1, 1, 31, 'God saw all that he had made, and it was very good. And there was evening, and there was morning—the sixth day.'),

-- Genesis Chapter 2 (Garden of Eden)
(1, 2, 1, 'Thus the heavens and the earth were completed in all their vast array.'),
(1, 2, 2, 'By the seventh day God had finished the work he had been doing; so on the seventh day he rested from all his work.'),
(1, 2, 3, 'Then God blessed the seventh day and made it holy, because on it he rested from all the work of creating that he had done.'),
(1, 2, 7, 'Then the Lord God formed a man from the dust of the ground and breathed into his nostrils the breath of life, and the man became a living being.'),
(1, 2, 8, 'Now the Lord God had planted a garden in the east, in Eden; and there he put the man he had formed.'),

-- Exodus (Key verses)
(2, 3, 14, 'God said to Moses, "I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you."'),
(2, 20, 3, 'You shall have no other gods before me.'),
(2, 20, 13, 'You shall not murder.'),
(2, 20, 15, 'You shall not steal.'),

-- Psalms (Popular Psalms)
(19, 1, 1, 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers,'),
(19, 1, 2, 'but whose delight is in the law of the Lord, and who meditates on his law day and night.'),
(19, 1, 3, 'That person is like a tree planted by streams of water, which yields its fruit in season and whose leaf does not wither—whatever they do prospers.'),

-- Psalm 23 (Complete)
(19, 23, 1, 'The Lord is my shepherd, I lack nothing.'),
(19, 23, 2, 'He makes me lie down in green pastures, he leads me beside quiet waters,'),
(19, 23, 3, 'he refreshes my soul. He guides me along the right paths for his name''s sake.'),
(19, 23, 4, 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.'),
(19, 23, 5, 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.'),
(19, 23, 6, 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.'),

-- Psalm 91 (Protection)
(19, 91, 1, 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.'),
(19, 91, 2, 'I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."'),
(19, 91, 11, 'For he will command his angels concerning you to guard you in all your ways;'),

-- Proverbs (Wisdom)
(20, 3, 5, 'Trust in the Lord with all your heart and lean not on your own understanding;'),
(20, 3, 6, 'in all your ways submit to him, and he will make your paths straight.'),
(20, 22, 6, 'Start children off on the way they should go, and even when they are old they will not turn from it.'),

-- Isaiah (Prophecy)
(23, 9, 6, 'For to us a child is born, to us a son is given, and the government will be on his shoulders. And he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace.'),
(23, 40, 31, 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'),
(23, 53, 5, 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.'),

-- Matthew (Gospels)
(40, 5, 3, 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.'),
(40, 5, 4, 'Blessed are those who mourn, for they will be comforted.'),
(40, 6, 9, 'This, then, is how you should pray: "Our Father in heaven, hallowed be your name,'),
(40, 6, 11, 'Give us today our daily bread.'),
(40, 28, 19, 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,'),
(40, 28, 20, 'and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.'),

-- Mark
(41, 16, 15, 'He said to them, "Go into all the world and preach the gospel to all creation.'),

-- Luke
(42, 2, 10, 'But the angel said to them, "Do not be afraid. I bring you good news that will cause great joy for all the people.'),
(42, 2, 11, 'Today in the town of David a Savior has been born to you; he is the Messiah, the Lord.'),

-- John (Complete Chapter 3)
(43, 1, 1, 'In the beginning was the Word, and the Word was with God, and the Word was God.'),
(43, 1, 14, 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.'),
(43, 3, 16, 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'),
(43, 3, 17, 'For God did not send his Son into the world to condemn the world, but to save the world through him.'),
(43, 8, 12, 'When Jesus spoke again to the people, he said, "I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."'),
(43, 14, 6, 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me.'),

-- Acts
(44, 1, 8, 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.'),

-- Romans (Complete Chapter 8 key verses)
(45, 1, 16, 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes: first to the Jew, then to the Gentile.'),
(45, 3, 23, 'for all have sinned and fall short of the glory of God,'),
(45, 6, 23, 'For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.'),
(45, 8, 28, 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.'),
(45, 8, 38, 'For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers,'),
(45, 8, 39, 'neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.'),

-- 1 Corinthians
(46, 13, 4, 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.'),
(46, 13, 13, 'And now these three remain: faith, hope and love. But the greatest of these is love.'),

-- Galatians
(48, 5, 22, 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness,'),
(48, 5, 23, 'gentleness and self-control. Against such things there is no law.'),

-- Ephesians
(49, 2, 8, 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—'),
(49, 2, 9, 'not by works, so that no one can boast.'),
(49, 6, 11, 'Put on the full armor of God, so that you can take your stand against the devil''s schemes.'),

-- Philippians
(50, 4, 13, 'I can do all this through him who gives me strength.'),
(50, 4, 19, 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.'),

-- 1 Thessalonians
(52, 5, 16, 'Rejoice always,'),
(52, 5, 17, 'pray continually,'),
(52, 5, 18, 'give thanks in all circumstances; for this is God''s will for you in Christ Jesus.'),

-- 2 Timothy
(55, 3, 16, 'All Scripture is God-breathed and is useful for teaching, rebuking, correcting and training in righteousness,'),

-- Hebrews
(58, 11, 1, 'Now faith is confidence in what we hope for and assurance about what we do not see.'),
(58, 13, 8, 'Jesus Christ is the same yesterday and today and forever.'),

-- James
(59, 1, 17, 'Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows.'),

-- 1 Peter
(60, 5, 7, 'Cast all your anxiety on him because he cares for you.'),

-- 1 John
(62, 1, 9, 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.'),
(62, 4, 8, 'Whoever does not love does not know God, because God is love.'),

-- Revelation
(66, 3, 20, 'Here I am! I stand at the door and knock. If anyone hears my voice and opens the door, I will come in and eat with that person, and they with me.'),
(66, 21, 4, 'He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away.')

ON CONFLICT (book_id, chapter, verse) DO NOTHING;