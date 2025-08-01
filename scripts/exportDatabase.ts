import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function exportDatabase() {
  try {
    console.log("📥 Starting database export...");
    
    // Create exports directory
    const exportsDir = path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // Export Bible Books
    console.log("📚 Exporting Bible books...");
    const { data: books, error: booksError } = await supabase
      .from("bible_books")
      .select("*")
      .order("book_order");

    if (booksError) {
      console.error("❌ Error exporting books:", booksError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "bible_books.json"),
        JSON.stringify(books, null, 2)
      );
      console.log(`✅ Exported ${books?.length || 0} Bible books`);
    }

    // Export Verses
    console.log("📖 Exporting verses...");
    const { data: verses, error: versesError } = await supabase
      .from("verses")
      .select("*")
      .order("book_id")
      .order("chapter")
      .order("verse");

    if (versesError) {
      console.error("❌ Error exporting verses:", versesError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "verses.json"),
        JSON.stringify(verses, null, 2)
      );
      console.log(`✅ Exported ${verses?.length || 0} verses`);
    }

    // Export Users (without sensitive data)
    console.log("👥 Exporting users...");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, display_name, created_at, updated_at");

    if (usersError) {
      console.error("❌ Error exporting users:", usersError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "users.json"),
        JSON.stringify(users, null, 2)
      );
      console.log(`✅ Exported ${users?.length || 0} users`);
    }

    // Export Notes
    console.log("📝 Exporting notes...");
    const { data: notes, error: notesError } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (notesError) {
      console.error("❌ Error exporting notes:", notesError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "notes.json"),
        JSON.stringify(notes, null, 2)
      );
      console.log(`✅ Exported ${notes?.length || 0} notes`);
    }

    // Export Highlights
    console.log("🎨 Exporting highlights...");
    const { data: highlights, error: highlightsError } = await supabase
      .from("highlights")
      .select("*")
      .order("created_at", { ascending: false });

    if (highlightsError) {
      console.error("❌ Error exporting highlights:", highlightsError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "highlights.json"),
        JSON.stringify(highlights, null, 2)
      );
      console.log(`✅ Exported ${highlights?.length || 0} highlights`);
    }

    // Export Circles
    console.log("👥 Exporting circles...");
    const { data: circles, error: circlesError } = await supabase
      .from("circles")
      .select("*")
      .order("created_at", { ascending: false });

    if (circlesError) {
      console.error("❌ Error exporting circles:", circlesError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "circles.json"),
        JSON.stringify(circles, null, 2)
      );
      console.log(`✅ Exported ${circles?.length || 0} circles`);
    }

    // Export Tags
    console.log("🏷️ Exporting tags...");
    const { data: tags, error: tagsError } = await supabase
      .from("tags")
      .select("*")
      .order("created_at", { ascending: false });

    if (tagsError) {
      console.error("❌ Error exporting tags:", tagsError);
    } else {
      fs.writeFileSync(
        path.join(exportsDir, "tags.json"),
        JSON.stringify(tags, null, 2)
      );
      console.log(`✅ Exported ${tags?.length || 0} tags`);
    }

    // Create export summary
    const summary = {
      export_date: new Date().toISOString(),
      tables_exported: {
        bible_books: books?.length || 0,
        verses: verses?.length || 0,
        users: users?.length || 0,
        notes: notes?.length || 0,
        highlights: highlights?.length || 0,
        circles: circles?.length || 0,
        tags: tags?.length || 0
      },
      total_records: (books?.length || 0) + (verses?.length || 0) + (users?.length || 0) + 
                    (notes?.length || 0) + (highlights?.length || 0) + (circles?.length || 0) + (tags?.length || 0)
    };

    fs.writeFileSync(
      path.join(exportsDir, "export_summary.json"),
      JSON.stringify(summary, null, 2)
    );

    console.log("\n🎉 Database export completed!");
    console.log(`📁 Files saved to: ${exportsDir}`);
    console.log(`📊 Total records exported: ${summary.total_records}`);

  } catch (error) {
    console.error("❌ Export failed:", error);
  }
}

exportDatabase();