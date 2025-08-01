import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BibleBook {
  id: number;
  name: string;
  abbreviation: string;
  testament: 'Old' | 'New';
  book_order: number;
  chapter_count: number;
}

interface Verse {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

async function uploadBibleBooks() {
  const booksFile = path.join(__dirname, "../data/bible_books.json");
  
  if (!fs.existsSync(booksFile)) {
    console.error(`Books file not found: ${booksFile}`);
    return;
  }

  try {
    const books: BibleBook[] = JSON.parse(fs.readFileSync(booksFile, "utf-8"));
    
    console.log(`📚 Uploading ${books.length} Bible books...`);

    const { data, error } = await supabase
      .from("bible_books")
      .insert(books);

    if (error) {
      console.error("❌ Failed to upload books:", error);
      return;
    }

    console.log(`✅ Successfully uploaded ${books.length} Bible books`);
  } catch (error) {
    console.error("❌ Error uploading books:", error);
  }
}

async function uploadAllVerses() {
  const dataDir = path.join(__dirname, "../data");
  
  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`);
    return;
  }

  const files = fs.readdirSync(dataDir).filter(file => 
    file.endsWith('.json') && file !== 'bible_books.json'
  );

  console.log(`📖 Found ${files.length} book files to upload`);

  for (const file of files) {
    const bookFile = path.join(dataDir, file);
    const bookName = path.basename(file, '.json');
    
    try {
      const verses: Verse[] = JSON.parse(fs.readFileSync(bookFile, "utf-8"));
      
      console.log(`📖 Uploading ${bookName} with ${verses.length} verses...`);

      // Upload verses in batches
      const batchSize = 1000;
      let totalUploaded = 0;

      for (let i = 0; i < verses.length; i += batchSize) {
        const batch = verses.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from("verses")
          .insert(batch);

        if (error) {
          console.error(`❌ Upload failed for ${bookName} batch ${i / batchSize + 1}:`, error);
          break;
        }

        totalUploaded += batch.length;
        console.log(`  ✅ Batch ${i / batchSize + 1}: ${totalUploaded}/${verses.length} verses`);
      }

      console.log(`🎉 Completed ${bookName}: ${totalUploaded} verses uploaded`);
    } catch (error) {
      console.error(`❌ Error uploading ${bookName}:`, error);
    }
  }
}

async function main() {
  console.log("🚀 Starting Bible data upload...");
  
  // First upload books
  await uploadBibleBooks();
  
  // Then upload all verses
  await uploadAllVerses();
  
  console.log("✅ Bible upload complete!");
}

main();