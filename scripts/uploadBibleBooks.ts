import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const bibleBooks = [
  // Old Testament
  { id: 1, name: "Genesis", abbreviation: "GEN", testament: "Old", book_order: 1, chapter_count: 50 },
  { id: 2, name: "Exodus", abbreviation: "EXO", testament: "Old", book_order: 2, chapter_count: 40 },
  { id: 3, name: "Leviticus", abbreviation: "LEV", testament: "Old", book_order: 3, chapter_count: 27 },
  { id: 4, name: "Numbers", abbreviation: "NUM", testament: "Old", book_order: 4, chapter_count: 36 },
  { id: 5, name: "Deuteronomy", abbreviation: "DEU", testament: "Old", book_order: 5, chapter_count: 34 },
  { id: 6, name: "Joshua", abbreviation: "JOS", testament: "Old", book_order: 6, chapter_count: 24 },
  { id: 7, name: "Judges", abbreviation: "JDG", testament: "Old", book_order: 7, chapter_count: 21 },
  { id: 8, name: "Ruth", abbreviation: "RUT", testament: "Old", book_order: 8, chapter_count: 4 },
  { id: 9, name: "1 Samuel", abbreviation: "1SA", testament: "Old", book_order: 9, chapter_count: 31 },
  { id: 10, name: "2 Samuel", abbreviation: "2SA", testament: "Old", book_order: 10, chapter_count: 24 },
  { id: 11, name: "1 Kings", abbreviation: "1KI", testament: "Old", book_order: 11, chapter_count: 22 },
  { id: 12, name: "2 Kings", abbreviation: "2KI", testament: "Old", book_order: 12, chapter_count: 25 },
  { id: 13, name: "1 Chronicles", abbreviation: "1CH", testament: "Old", book_order: 13, chapter_count: 29 },
  { id: 14, name: "2 Chronicles", abbreviation: "2CH", testament: "Old", book_order: 14, chapter_count: 36 },
  { id: 15, name: "Ezra", abbreviation: "EZR", testament: "Old", book_order: 15, chapter_count: 10 },
  { id: 16, name: "Nehemiah", abbreviation: "NEH", testament: "Old", book_order: 16, chapter_count: 13 },
  { id: 17, name: "Esther", abbreviation: "EST", testament: "Old", book_order: 17, chapter_count: 10 },
  { id: 18, name: "Job", abbreviation: "JOB", testament: "Old", book_order: 18, chapter_count: 42 },
  { id: 19, name: "Psalms", abbreviation: "PSA", testament: "Old", book_order: 19, chapter_count: 150 },
  { id: 20, name: "Proverbs", abbreviation: "PRO", testament: "Old", book_order: 20, chapter_count: 31 },
  { id: 21, name: "Ecclesiastes", abbreviation: "ECC", testament: "Old", book_order: 21, chapter_count: 12 },
  { id: 22, name: "Song of Solomon", abbreviation: "SNG", testament: "Old", book_order: 22, chapter_count: 8 },
  { id: 23, name: "Isaiah", abbreviation: "ISA", testament: "Old", book_order: 23, chapter_count: 66 },
  { id: 24, name: "Jeremiah", abbreviation: "JER", testament: "Old", book_order: 24, chapter_count: 52 },
  { id: 25, name: "Lamentations", abbreviation: "LAM", testament: "Old", book_order: 25, chapter_count: 5 },
  { id: 26, name: "Ezekiel", abbreviation: "EZK", testament: "Old", book_order: 26, chapter_count: 48 },
  { id: 27, name: "Daniel", abbreviation: "DAN", testament: "Old", book_order: 27, chapter_count: 12 },
  { id: 28, name: "Hosea", abbreviation: "HOS", testament: "Old", book_order: 28, chapter_count: 14 },
  { id: 29, name: "Joel", abbreviation: "JOE", testament: "Old", book_order: 29, chapter_count: 3 },
  { id: 30, name: "Amos", abbreviation: "AMO", testament: "Old", book_order: 30, chapter_count: 9 },
  { id: 31, name: "Obadiah", abbreviation: "OBA", testament: "Old", book_order: 31, chapter_count: 1 },
  { id: 32, name: "Jonah", abbreviation: "JON", testament: "Old", book_order: 32, chapter_count: 4 },
  { id: 33, name: "Micah", abbreviation: "MIC", testament: "Old", book_order: 33, chapter_count: 7 },
  { id: 34, name: "Nahum", abbreviation: "NAH", testament: "Old", book_order: 34, chapter_count: 3 },
  { id: 35, name: "Habakkuk", abbreviation: "HAB", testament: "Old", book_order: 35, chapter_count: 3 },
  { id: 36, name: "Zephaniah", abbreviation: "ZEP", testament: "Old", book_order: 36, chapter_count: 3 },
  { id: 37, name: "Haggai", abbreviation: "HAG", testament: "Old", book_order: 37, chapter_count: 2 },
  { id: 38, name: "Zechariah", abbreviation: "ZEC", testament: "Old", book_order: 38, chapter_count: 14 },
  { id: 39, name: "Malachi", abbreviation: "MAL", testament: "Old", book_order: 39, chapter_count: 4 },
  
  // New Testament
  { id: 40, name: "Matthew", abbreviation: "MAT", testament: "New", book_order: 40, chapter_count: 28 },
  { id: 41, name: "Mark", abbreviation: "MRK", testament: "New", book_order: 41, chapter_count: 16 },
  { id: 42, name: "Luke", abbreviation: "LUK", testament: "New", book_order: 42, chapter_count: 24 },
  { id: 43, name: "John", abbreviation: "JHN", testament: "New", book_order: 43, chapter_count: 21 },
  { id: 44, name: "Acts", abbreviation: "ACT", testament: "New", book_order: 44, chapter_count: 28 },
  { id: 45, name: "Romans", abbreviation: "ROM", testament: "New", book_order: 45, chapter_count: 16 },
  { id: 46, name: "1 Corinthians", abbreviation: "1CO", testament: "New", book_order: 46, chapter_count: 16 },
  { id: 47, name: "2 Corinthians", abbreviation: "2CO", testament: "New", book_order: 47, chapter_count: 13 },
  { id: 48, name: "Galatians", abbreviation: "GAL", testament: "New", book_order: 48, chapter_count: 6 },
  { id: 49, name: "Ephesians", abbreviation: "EPH", testament: "New", book_order: 49, chapter_count: 6 },
  { id: 50, name: "Philippians", abbreviation: "PHP", testament: "New", book_order: 50, chapter_count: 4 },
  { id: 51, name: "Colossians", abbreviation: "COL", testament: "New", book_order: 51, chapter_count: 4 },
  { id: 52, name: "1 Thessalonians", abbreviation: "1TH", testament: "New", book_order: 52, chapter_count: 5 },
  { id: 53, name: "2 Thessalonians", abbreviation: "2TH", testament: "New", book_order: 53, chapter_count: 3 },
  { id: 54, name: "1 Timothy", abbreviation: "1TI", testament: "New", book_order: 54, chapter_count: 6 },
  { id: 55, name: "2 Timothy", abbreviation: "2TI", testament: "New", book_order: 55, chapter_count: 4 },
  { id: 56, name: "Titus", abbreviation: "TIT", testament: "New", book_order: 56, chapter_count: 3 },
  { id: 57, name: "Philemon", abbreviation: "PHM", testament: "New", book_order: 57, chapter_count: 1 },
  { id: 58, name: "Hebrews", abbreviation: "HEB", testament: "New", book_order: 58, chapter_count: 13 },
  { id: 59, name: "James", abbreviation: "JAS", testament: "New", book_order: 59, chapter_count: 5 },
  { id: 60, name: "1 Peter", abbreviation: "1PE", testament: "New", book_order: 60, chapter_count: 5 },
  { id: 61, name: "2 Peter", abbreviation: "2PE", testament: "New", book_order: 61, chapter_count: 3 },
  { id: 62, name: "1 John", abbreviation: "1JN", testament: "New", book_order: 62, chapter_count: 5 },
  { id: 63, name: "2 John", abbreviation: "2JN", testament: "New", book_order: 63, chapter_count: 1 },
  { id: 64, name: "3 John", abbreviation: "3JN", testament: "New", book_order: 64, chapter_count: 1 },
  { id: 65, name: "Jude", abbreviation: "JUD", testament: "New", book_order: 65, chapter_count: 1 },
  { id: 66, name: "Revelation", abbreviation: "REV", testament: "New", book_order: 66, chapter_count: 22 }
];

async function uploadBibleBooks() {
  try {
    console.log("🚀 Starting Bible books upload...");
    
    // First, clear existing data including any placeholder entries
    console.log("🧹 Clearing existing books...");
    const { error: deleteError } = await supabase
      .from("bible_books")
      .delete()
      .gt('id', 0); // Delete all records (including placeholder)
    
    if (deleteError) {
      console.error("❌ Error clearing existing books:", deleteError);
      return;
    }
    
    console.log("✅ Existing books cleared");
    
    // Upload new books
    console.log(`📚 Uploading ${bibleBooks.length} Bible books...`);
    
    const { data, error } = await supabase
      .from("bible_books")
      .insert(bibleBooks)
      .select();
    
    if (error) {
      console.error("❌ Upload failed:", error);
      return;
    }
    
    console.log(`🎉 Successfully uploaded ${data?.length || 0} Bible books!`);
    console.log("📖 First few books uploaded:", data?.slice(0, 5).map(book => book.name).join(", "));
    
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

uploadBibleBooks();