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

interface Verse {
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

interface BookData {
  id: number;
  name: string;
  verses: Verse[];
}

async function uploadBook(bookName: string) {
  const bookFile = path.join(__dirname, `../data/${bookName}.json`);
  
  if (!fs.existsSync(bookFile)) {
    console.error(`File not found: ${bookFile}`);
    return;
  }

  try {
    const bookData: BookData = JSON.parse(fs.readFileSync(bookFile, "utf-8"));
    
    console.log(`📖 Uploading ${bookData.name} with ${bookData.verses.length} verses...`);

    // Upload verses in batches of 1000 to avoid timeout
    const batchSize = 1000;
    let totalUploaded = 0;

    for (let i = 0; i < bookData.verses.length; i += batchSize) {
      const batch = bookData.verses.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from("verses")
        .insert(batch);

      if (error) {
        console.error(`❌ Upload failed for batch ${i / batchSize + 1}:`, error);
        return;
      }

      totalUploaded += batch.length;
      console.log(`✅ Uploaded batch ${i / batchSize + 1}: ${totalUploaded}/${bookData.verses.length} verses`);
    }

    console.log(`🎉 Successfully uploaded ${totalUploaded} verses from ${bookData.name}`);
  } catch (error) {
    console.error(`❌ Error uploading ${bookName}:`, error);
  }
}

// Get book name from command line argument
const bookName = process.argv[2];

if (!bookName) {
  console.error("Usage: npm run upload-book <bookName>");
  console.error("Example: npm run upload-book Genesis");
  process.exit(1);
}

uploadBook(bookName);