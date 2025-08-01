import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  try {
    console.log("🔍 Checking database structure and data...");
    
    // Check bible_books table
    console.log("\n📚 Checking bible_books table:");
    const { data: books, error: booksError } = await supabase
      .from("bible_books")
      .select("*")
      .limit(5);
    
    if (booksError) {
      console.error("❌ Error fetching books:", booksError);
    } else {
      console.log(`✅ Found ${books?.length || 0} books (showing first 5):`);
      books?.forEach(book => {
        console.log(`  - ${book.id}: ${book.name} (${book.testament})`);
      });
    }
    
    // Check verses table
    console.log("\n📖 Checking verses table:");
    const { data: verses, error: versesError } = await supabase
      .from("verses")
      .select("*")
      .limit(5);
    
    if (versesError) {
      console.error("❌ Error fetching verses:", versesError);
    } else {
      console.log(`✅ Found ${verses?.length || 0} verses (showing first 5):`);
      verses?.forEach(verse => {
        console.log(`  - Book ${verse.book_id}, Ch ${verse.chapter}:${verse.verse} - "${verse.text.substring(0, 50)}..."`);
      });
    }
    
    // Check table structure
    console.log("\n🏗️ Checking table structure:");
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'verses' })
      .select();
    
    if (tableError) {
      console.log("⚠️ Could not get table structure info");
    }
    
  } catch (error) {
    console.error("❌ Database check failed:", error);
  }
}

checkDatabase();